module.exports.counter = function(arr){
    return 'There are ' + arr.length + ' elements in this array';
}

module.exports.adder = function(a, b){
    //  uses template strings
    return `The sum of the two numbers is ${a+b}`;
}

module.exports.pi = 3.142;

// module.exports = {
//     counter: counter,
//     adder: adder,
//     pi: pi,
// }