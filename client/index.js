import Web3 from 'web3';
import configuration from '../build/contracts/Marketplace.json';
import 'bootstrap/dist/css/bootstrap.css';

const createElementFromString = (string) => {
  const el = document.createElement('div');
  el.innerHTML = string;
  return el.firstChild;
};

const CONTRACT_ADDRESS = "0x71b1d8de702cC0255Ac24e2E123aBa540ECE2E76" // configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

console.log(CONTRACT_ADDRESS)

const web3 = new Web3(
  Web3.givenProvider || 'http://127.0.0.1:7545'
);
const contract = new web3.eth.Contract(
  CONTRACT_ABI,
  CONTRACT_ADDRESS
);

let account;

const accountEl = document.getElementById('account');
const offerEl = document.getElementById('tickets');
const EMPTY_ADDRESS =
  '0x0000000000000000000000000000000000000000';

const buy = async (price, id) => {
  await contract.methods
    .buy(id)
    .send({ from: account, value: price });
};

const withdraw = async (id) => {
  await contract.methods
    .withdraw(id)
    .send({ from: account });
};

const refreshOffers = async () => {
  offerEl.innerHTML = '';
  // console.log(offers)
  const offers = await contract.methods.getOffers().call()
  console.log(offers)

  state_dict = {0: "Created", 1: "Sold", 2: "Withdrawn"}
  
  
  for (let i = 0; i < offers.length; i++) {
    price = offers[i][0]
    title = offers[i][1]
    description = offers[i][2]
    photo = offers[i][3]
    seller = offers[i][4]
    buyer = offers[i][5]
    state = state_dict[offers[i][6]]
    console.log(document.getElementById("checkboxIsCreated").value)
    if (state == "Created" && !document.getElementById("checkboxIsCreated").checked) {
      continue;
    }
    if (state == "Sold" && !document.getElementById("checkboxIsSold").checked) {
      continue;
    }
    if (state == "Withdrawn" && !document.getElementById("checkboxIsWithdrawn").checked) {
      continue;
    }

    
    // console.log(price)
  //   ticket.id = i;
    if (seller !== EMPTY_ADDRESS) {
      // const buttonBuy = buy.bind(null, price, i)
      const ticketEl = createElementFromString(
        `<div class="ticket card" style="width: 18rem;">
          <center><h3 class="card-title">${title}</h3></center>
          <img src="${photo}" class="card-img-top" alt="...">
          <div class="card-body">
            
            <p><b>Description:</b> ${description}</p>
            <p><b>Seller:</b> ${seller}</p>
            <p><b>State:</b> ${state}</p>
            <p class="card-text">${
              price / 1e18
            } ETH</p>
          </div>
        </div>`
        );
      if(state === "Created") {
        const buttonBuy = createElementFromString(
          `<button class="btn btn-primary">Buy</button>`
        )
        buttonBuy.onclick = buy.bind(null, price, i);
        ticketEl.appendChild(buttonBuy);
        const buttonWithdraw = createElementFromString(
          `<button class="btn btn-secondary"> Withdraw</button>`
          )
        buttonWithdraw.onclick = withdraw.bind(null, i)
        ticketEl.appendChild(buttonWithdraw);
      }
      
     
      offerEl.appendChild(ticketEl);
      
    }
   }
};

const main = async () => {
  const accounts = await web3.eth.requestAccounts();
  account = accounts[0];
  accountEl.innerText = account;
  await refreshOffers();

  
  document.getElementById("checkboxIsCreated").addEventListener('change', function() {
    refreshOffers();
  });
  document.getElementById("checkboxIsSold").addEventListener('change', function() {
    refreshOffers();
  });
  document.getElementById("checkboxIsWithdrawn").addEventListener('change', function() {
    refreshOffers();
  });


};

main();
