const gridContainer=document.querySelector(".grid-container");
let cards=[];
let firstcard,secondcard;
let lockBoard=false;
let score=0;

document.querySelector(".score").textContent=score;

fetch("./data/cards.json").then((res)=> res.json()).then((data)=>{
    cards=[...data, ...data];
    shuffleCards();
    generateCards();
});

function shuffleCards(){
    let currIndex=cards.length,
    randomIndex,
    tempvalue;
    while(currIndex!==0){
        randomIndex=Math.floor(Math.random()*currIndex);
        currIndex -=1;
        tempvalue=cards[currIndex];
        cards[currIndex]=cards[randomIndex];
        cards[randomIndex]=tempvalue;

    }
}

function generateCards(){
    for(let card of cards){
        const cardElement=document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name",card.name);
        cardElement.innerHTML=`
        <div class="front">
            <img class="front-image" src=${card.image} />
        </div>
        <div class="back"></div> `;

        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click",flipcard);
     }
}

function flipcard(){
    if(lockBoard)return;
    if(this===firstcard)return;

    this.classList.add("flipped");

    if(!firstcard){
        firstcard=this;
        return;
    }

    secondcard=this;
    score++;
    document.querySelector(".score").textContent=score;
    lockBoard=true;

    checkForMatch();
}

function checkForMatch(){
    let isMatch=firstcard.dataset.name === secondcard.dataset.name;

    isMatch?disableCards():unflipCards();

}

function disableCards(){
    firstcard.removeEventListener("click",flipcard);
    secondcard.removeEventListener("click",flipcard);

    resetBoard();
}

function unflipCards(){
    setTimeout(()=>{
        firstcard.classList.remove("flipped");
        secondcard.classList.remove("flipped");
        resetBoard();
    },1000);
}

function resetBoard(){
    firstcard=null;
    secondcard=null;
    lockBoard=false;
}

function restart(){
    resetBoard();
    shuffleCards();
    score=0;
    document.querySelector(".score").textContent=score;
    gridContainer.innerHTML="";
    generateCards();
}