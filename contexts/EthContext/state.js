const actions = {
  init: "INIT",
  setCurrentState: "SetCurrentState",
  registeringVoters: "RegisteringVoters",
  startProposalsRegistration: "StartProposals",
  endProposalsRegistration: "EndProposals",
  startVotingSession: "StartVotingSession",
  stopVotingSession: "StopVotingSession",
};

const initialState = {
  currentState: 0,
  workflow: {
    registeringVoters: true,
    proposalsRegistration: false,
    votingSession: false,
    votesTallied: false,
  },
  artifact: null,
  accounts: null,
  networkID: null,
  contract: null,
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.setCurrentState:
      return {
        ...state,
        currentState: data,
      };
    case actions.startVotingSession:
      return {
        ...state,
        currentState: 3,
        workflow: { proposalsRegistration: false, registeringVoters: false },
      };

    case actions.stopVotingSession:
      return {
        ...state,
        currentState: 4,
        workflow: { proposalsRegistration: false, registeringVoters: false },
      };

    case actions.stopProposalsRegistration:
      return {
        ...state,
        currentState: 2,
        workflow: { proposalsRegistration: false, registeringVoters: false },
      };
    case actions.startProposalsRegistration:
      return {
        ...state,
        currentState: 1,
        workflow: { proposalsRegistration: true, registeringVoters: false },
      };
    case actions.registeringVoters:
      return { ...state, workflow: { registeringVoters: data } };
    case actions.init:
      return { ...state, ...data };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { actions, initialState, reducer };
