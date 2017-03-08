require 'google/apis/sheets_v4'
require 'googleauth'
require 'googleauth/stores/file_token_store'

require 'fileutils'
require 'pg'

OOB_URI = 'urn:ietf:wg:oauth:2.0:oob'
APPLICATION_NAME = 'LunchIt'
CLIENT_SECRETS_PATH = 'client_secret.json'
CREDENTIALS_PATH = File.join("sheets.googleapis.com.yaml")
SCOPE = Google::Apis::SheetsV4::AUTH_SPREADSHEETS_READONLY

##
# Ensure valid credentials, either by restoring from the saved credentials
# files or intitiating an OAuth2 authorization. If authorization is required,
# the user's default browser will be launched to approve the request.
#
# @return [Google::Auth::UserRefreshCredentials] OAuth2 credentials
def authorize
  FileUtils.mkdir_p(File.dirname(CREDENTIALS_PATH))

  client_id = Google::Auth::ClientId.from_file(CLIENT_SECRETS_PATH)
  token_store = Google::Auth::Stores::FileTokenStore.new(file: CREDENTIALS_PATH)
  authorizer = Google::Auth::UserAuthorizer.new(
    client_id, SCOPE, token_store)
  user_id = 'default'
  credentials = authorizer.get_credentials(user_id)
  if credentials.nil?
    url = authorizer.get_authorization_url(
      base_url: OOB_URI)
    puts "Open the following URL in the browser and enter the " +
         "resulting code after authorization"
    puts url
    code = gets
    credentials = authorizer.get_and_store_credentials_from_code(
      user_id: user_id, code: code, base_url: OOB_URI)
  end
  credentials
end

puts CREDENTIALS_PATH
# Initialize the API
service = Google::Apis::SheetsV4::SheetsService.new
service.client_options.application_name = APPLICATION_NAME
service.authorization = authorize

spreadsheet_id = '18wA7gXj_vDsI6UVD_qx5TEnW7U8_vz77nY_3GYlvCAc'
range = '2016!A2:C'
sheet_results = service.get_spreadsheet_values(spreadsheet_id, range)
# conn.exec("CREATE TABLE lunches_test (atom_a CHAR(255), atom_b CHAR(255), date date)")

def get_firstname_lastinitial name
  split_name = name.split()
  return (split_name.size() > 1) ? split_name[0] + ' ' + split_name[1][0] : name
end

conn = PG.connect(ENV['DATABASE_URL'])
db_results = conn.exec("SELECT user_id, name FROM users")
existing_users = db_results.map{|user|
  {
    user_id: user['user_id'],
    user_name: get_firstname_lastinitial(user['name'])
  }
}

found_pairs = sheet_results.values.map{ |row|
  {
    atom_a_name: row[1],
    atom_b_name: row[2],
    date: row[0]
  }
}

# Get all rows where both people are in the db already
pairs_with_existing_users = []
found_pairs.each do |pair|
  found_atom_a = existing_users.find{ |user| user[:user_name].eql?(pair[:atom_a_name])}
  found_atom_b = existing_users.find{ |user| user[:user_name].eql?(pair[:atom_b_name])}

  if found_atom_a && found_atom_b
    pairs_with_existing_users.push({
      atom_a: found_atom_a[:user_id],
      atom_b: found_atom_b[:user_id],
      date: pair[:date]
    })
  else
    puts "[TEST] #{found_atom_b ? pair[:atom_a_name] : pair[:atom_b_name]} not found in users"
    false
  end
end

call = "INSERT INTO lunches (date, atom_a, atom_b) VALUES "
pairs_with_existing_users.each do |pair|
  call = call + "(\'#{pair[:date]}\', \'#{pair[:atom_a]}\', \'#{pair[:atom_b]}\'),\n"
end
call.chomp!(",\n")
call = call + "ON CONFLICT DO NOTHING"
# print call
conn.exec(call)
