function sayHi(){
    alert('hello');
}

function confirmDelete(productName){
    let del = confirm("Are you sure to delete " + productName + "?"); //data type = boolean
    if(del){
        return true;
    }else{
        return false;
    }
}