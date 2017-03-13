import React from 'react';
import { connect } from 'react-redux';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import '../../styles/core.scss'

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
    fetchAtom : () => fetchAtom(),
    fetchAtoms : (isOpen) => fetchAtoms(isOpen),
    updateUser : (eventKey) => updateUser(eventKey)
  };
};
const Pairer = (props) => {
  var atoms = [];
  if (props.atomList){
    atoms = props.atomList.map(function(atom){
      return <MenuItem eventKey={atom.user_id}>{atom.name}</MenuItem>
    });
  }
  return (
    <div style={{ margin: '0 auto' }} >
      <DropdownButton className="lunchit-secondary-button" title={props.selectedUser.name} onToggle={props.fetchAtoms} id="dropdown" onSelect={props.updateUser}>
        {atoms}
      </DropdownButton>
      <h2 className="lunchit-header">Pair: SOMEBODY!{props.pair}</h2>
      <Button className="lunchit-action-button" onClick={props.fetchAtom} >
        Random Lunch
      </Button>
    </div>
  )
};

Pairer.propTypes = {
  pair : React.PropTypes.string,
  fetchAtom : React.PropTypes.func.isRequired,
  fetchAtoms : React.PropTypes.func.isRequired,
  updateUser : React.PropTypes.func.isRequired,
  atomList: React.PropTypes.array,
  pairButtonDisabled: React.PropTypes.bool,
  selectedUser: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Pairer);
