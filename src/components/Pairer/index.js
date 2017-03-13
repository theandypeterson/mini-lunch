import React from 'react';
import { connect } from 'react-redux';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import '../../styles/core.scss'
import { pickPair } from '../../actions/pairer';

const mapStateToProps = (state) => {
  const { pair, atomList, selectedUser, pairButtonDisabled } = state.pairer;
  return {
    pair : pair,
    atomList: atomList,
    selectedUser: selectedUser,
    pairButtonDisabled: pairButtonDisabled
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onPairButtonClick: () => dispatch(pickPair()),
  };
};
const Pairer = (props) => {
  const {
    onPairButtonClick,
    atomList,
    selectedUser,
    fetchAtoms,
    updateUser,
    pair
  } = props;
  var atoms = [];
  if (atomList){
    atoms = atomList.map(function(atom){
      return <MenuItem eventKey={atom.user_id}>{atom.name}</MenuItem>
    });
  }
  return (
    <div style={{ margin: '0 auto' }} >
      <DropdownButton className="lunchit-secondary-button" title={selectedUser.name} onToggle={fetchAtoms} id="dropdown" onSelect={updateUser}>
        {atoms}
      </DropdownButton>
      <h2 className="lunchit-header">Pair: {pair}</h2>
      <Button className="lunchit-action-button" onClick={onPairButtonClick}>
        Random Lunch
      </Button>
    </div>
  )
};

Pairer.propTypes = {
  pair : React.PropTypes.string,
  fetchAtom : React.PropTypes.func,
  fetchAtoms : React.PropTypes.func,
  updateUser : React.PropTypes.func,
  atomList: React.PropTypes.array,
  pairButtonDisabled: React.PropTypes.bool,
  selectedUser: React.PropTypes.object,
  onPairButtonClick: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Pairer);
