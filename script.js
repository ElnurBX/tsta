let localbasket = JSON.parse(localStorage.getItem("basket")) || [];
const basketZone=document.getElementById("basketdrop")
const cards = document.getElementById("pro__cards");

async function checkData() {
    const response = await fetch("http://tsta.netlify.app:4000/Flovers");
    const flovers = await response.json();
    return flovers;
}
async function sortedToType(value) {
    let data = await checkData();
    let filteredData = data.filter(element => element.type.includes(value));
    return filteredData;
}
async function cardsRenderUi(array) {
    cards.innerHTML = '';
    let htmlContent = ''; 
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        htmlContent += `
            <div class="pro__card">
                <div class="pro__cards__img">
                    <img src="${element.img}" alt="${element.title}">
                </div>
                <div class="pro__card__info__cut">
                    <div class="pro__card__info">
                        <div class="pro__card__info__add">
                            <button onclick="addBasket(${element.id})">Add to cart</button>
                        </div>
                        <div class="pro__card__info__main">
                            <h6>${element.title}</h6>
                            <span>$${element.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    cards.innerHTML = htmlContent; 
}
const lodingcards=()=>{
    cards.innerHTML=`
        <div class="lodingCards">
            <h2>LoodIng...</h2>
        </div>
    `
}
async function initialize(type) {   
    lodingcards()
    const data = await sortedToType(type);

    cardsRenderUi(data);
}



// *basket


async function addBasket(id) {
    let count = 1; 
    let data = await checkData();
    let add = data.find(element => element.id == id);
    let testdata = localbasket.find(element => element.item.id == id); 
    if (add) {
        if (testdata) {
            let adds = localbasket.find(element => element.item.id == id); 
            adds.count += 1; 
            adds.totalPrice = adds.count * adds.item.price;
        } else {
            let adds = {
                count: count,
                item: add,
                totalPrice: count * add.price
            };
            localbasket.push(adds);
        }
        localStorage.setItem("basket", JSON.stringify(localbasket));
        renderBasket() 
    } else {
        console.log("Bu məhsul movcud detil."); 
    }
}
const hesab=document.getElementById("hesab")
const cout=document.getElementById("cout")
async function renderBasket() {
    if (localbasket.length > 0) {
        cout.style.display="flex"
        cout.innerHTML=`${localbasket.length}`
        let item = ''; 
        let totalPrice = 0; 
        for (let i = 0; i < localbasket.length; i++) {
            const element = localbasket[i];
            item += `
                <div class="basketcard d-flex ">
                    <div class="basketimg">
                        <img height="66" src="${element.item.img}" alt="${element.item.title}">
                    </div>
                    <div class="basketinfo">
                        <h6>${element.item.title}</h6>
                        <span>$${element.item.price}X${element.count}</span>
                        
                    </div>
                    <button onclick="removeFromBasket('${element.item.id}')">x</button>
                </div>
            `;
            totalPrice += element.totalPrice;
            hesab.innerHTML=`cart (${totalPrice})`
        }
        item += `
            <div class="basketinformativ">
                <div class="total">
                    <p>Toplam: $${totalPrice}</p>
                </div>
                <div class="btns">
                    <button class="btns-o">VIEV CART</button>
                    <button class="btns-b">CHECKOUT</button>
                </div>
            </div>
        `;
        basketZone.innerHTML = item;
    } else {
        cout.style.display="none"
        basketZone.innerHTML = `			<p>No products in the cart.</p>`;
    }
}

function removeFromBasket(id){
    let target = localbasket.find((item) => item.item.id == id);
    if (target.count > 1) {
        target.count--;
        target.totalPrice =target.count *target.item.price ;
        localStorage.setItem("basket", JSON.stringify(localbasket));
        renderBasket();
    } else {
        const indexOfTarget = localbasket.indexOf(target);
        localbasket.splice(indexOfTarget, 1);
        localStorage.setItem("basket", JSON.stringify(localbasket));
        renderBasket();
        if(localbasket.length==0){
            hesab.innerHTML=`cart (0)`
        }
    }
}

renderBasket()
initialize("ALL");