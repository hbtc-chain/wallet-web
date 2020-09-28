/**
 * 根据消息类型，获取签名的地址
 * @param {object} msgs  {type: 'xxxx', value:{}}
 * @return {string} address
 */
function get_info_from_msgs(msgs) {
  let data = { address: "", msg_amount: "", msg_token: "" };
  if (!msgs.type || !msgs.value) {
    return data;
  }
  const value = msgs.value;
  let address = "";
  switch (msgs.type) {
    case "hbtcchain/transfer/MsgSend":
      address = value.from_address;
      break;
    case "hbtcchain/MsgDelegate":
      address = value.delegator_address;
      break;
    case "hbtcchain/MsgUndelegate":
      address = value.delegator_address;
      break;
    case "hbtcchain/keygen/MsgKeyGen":
      address = value.from;
      break;
    case "hbtcchain/MsgWithdrawDelegationReward":
      address = value.delegator_address;
      break;
    case "hbtcchain/transfer/MsgDeposit":
      address = value.from_cu;
      break;
    case "hbtcchain/transfer/MsgWithdrawal":
      address = value.from_cu;
      break;
    case "hbtcchain/gov/MsgSubmitProposal":
      address = value.proposer;
      break;
    case "hbtcchain/gov/MsgDeposit":
      address = value.depositor;
      break;
    case "hbtcchain/gov/MsgVote":
      address = value.voter;
      break;
    default:
      address = value.from;
  }
  data.address = address;
  return data;
}

export default {
  get_info_from_msgs,
};
