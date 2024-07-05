
const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');

const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyMessage = document.querySelector('[data-copyMessage]');
const copyButton = document.querySelector('[data-copyButton]');

const upperCaseCheck = document.querySelector('#uppercase');
const lowerCaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');

const indicator = document.querySelector('[data-indicator]');
const generaterButton = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');

const symbols = "!@#$%^&*(){}[]-_=+;:~`";


let password = "";
let passwordLength = 5;
let checkCount = 1;
handleSlider();


// set the length of password
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}


function setIndicator(color, text) {
    indicator.innerText = text;
    indicator.style.color = color;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 10);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    return symbols[getRandomInteger(0, symbols.length)];
}

function calculateStrength(){
    if(upperCaseCheck.checked && lowerCaseCheck.checked && (numbersCheck.checked || symbolsCheck.checked) && password.length >= 8){
        setIndicator("#0f0", "Strong");
    }
    else if((upperCaseCheck.checked || lowerCaseCheck.checked) && (numbersCheck.checked || symbolsCheck.checked) && password.length >= 6){
        setIndicator("#ff0", "Average");
    }
    else{
        setIndicator("#f00", "Poor");
    }
}

async function copyContent(){
    try { 
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText = "Copied!";

        console.log("Working fine");

        setTimeout(() => {
            copyMessage.innerText = null;
        }, 2000);
    }
    catch(error){
        copyMessage.innerText = "Failed";
    }

    copyMessage.classList.add("active");

    setTimeout(() => {
        copyMessage.classList.remove("active");
    }, 2000);
}


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyButton.addEventListener('click', (e) => {
   if(passwordDisplay.value) copyContent();
});

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    })

    // handling an important edge case here
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

function shufflePassword(array){
    // Fisher yates method for shuffling the elements of array
    for(let i = 0; i < array.length; i++){
        const random_index = Math.floor(Math.random() * (i + 1));
        const current_element = array[i];
        array[i] = array[random_index];
        array[random_index] = current_element;
    }

    let str = "";
    array.forEach((element) => (str += element));

    return str;
}

generaterButton.addEventListener('click', (e) => {
    if(checkCount <= 0) return;

    console.log("Here we go, start");
    // now generate the password
    // firstly remove the old password, if there is any
    password = "";

    // following is not a good approach
    // Just insert all the functions in an array and then call it 

    // if(upperCaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowerCaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }


    const functionArray = [];

    // Jo jo checkbox ticked hain, unhe array me daaldo 
    if(upperCaseCheck.checked) functionArray.push(generateUpperCase);
    if(lowerCaseCheck.checked) functionArray.push(generateLowerCase);
    if(numbersCheck.checked) functionArray.push(generateRandomNumber);
    if(symbolsCheck.checked) functionArray.push(generateSymbol);

    console.log("function array insertion done");

    // must add these characters in the password
    for(let i = 0; i < functionArray.length; i++){
        password += functionArray[i]();
    }

    console.log("compulsory insertion done");

    // remaining addition 
    for(let i = 0; i < passwordLength - functionArray.length; i++){
        const random_index = getRandomInteger(0, functionArray.length);
        password += functionArray[random_index]();
    }

    console.log("remaining addition done");

    // Now shuffle all the characters in the password

    password = shufflePassword(Array.from(password));

    console.log("Shuffling done");

    // now show the password in the display
    passwordDisplay.value = password;

    // calculate the strength of generated password
    calculateStrength();

});