import Web3 from 'web3';
import configuration from '../build/contracts/Marketplace.json';
import 'bootstrap/dist/css/bootstrap.css';

const createElementFromString = (string) => {
  const el = document.createElement('div');
  el.innerHTML = string;
  return el.firstChild;
};

const CONTRACT_ADDRESS = "0x71b1d8de702cC0255Ac24e2E123aBa540ECE2E76" //configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

const web3 = new Web3(
  Web3.givenProvider || 'http://127.0.0.1:7545'
);
const contract = new web3.eth.Contract(
  CONTRACT_ABI,
  CONTRACT_ADDRESS
);

let account;

const accountEl = document.getElementById('account');

const createOffer = async () => {
  var price = document.getElementById("price").value
  var title = document.getElementById("title").value
  var description = document.getElementById("description").value
  var photo = document.getElementById("photo").value
  console.log(price)
  console.log(photo)
  
  await contract.methods
    .create(price, title, description, photo)
    .send({ from: account })
}

const main = async () => {
  const accounts = await web3.eth.requestAccounts();
  account = accounts[0];
  accountEl.innerText = account;
  document.getElementById("create-offer").onclick = createOffer.bind()
};

main();
