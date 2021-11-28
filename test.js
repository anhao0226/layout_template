


const date = new Date();

const year = date.getFullYear();
const month = date.getMonth();

//
function daysInMonth(year, month) {
    const d = new Date(year, month, 0);
    return d.getDate();
}


const M = (date.getDate() - 2) % 7;


const render = new Array(42);

console.log(date.getDay());
console.log(daysInMonth(year, month))
console.log(daysInMonth(year, month - 1));



