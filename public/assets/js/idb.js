//create var to hold the connection
let db;
//set up connection
const request = indexedDB.open("pizza_hunt", 1); // 1 is the version

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
  // save a reference to the database
  const db = event.target.result;
  // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

request.onsuccess = function (event) {
  //when we successfully make the db with its object store
  db = event.target.result;
  // check if app is online, if yes run uploadPizza() function to send all local db data to api
  if (navigator.onLine) {
    // we haven't created this yet, but we will soon, so let's comment it out for now
    uploadPizza();
  }
};

request.onerror = function (event) {
  //log the error here
  console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
  //open new transaction with db with readwrite permissions
  const transaction = db.transaction(["new_pizza"], "readwrite"); //we have to explicitly open each transaction

  //access the object store for new_pizza
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  //add recored to your store with add method
  pizzaObjectStore.add(record);
}

//upload pizza to the db
function uploadPizza() {
  //open transaction to db
  const transaction = db.transaction(["new_pizza"], "readwrite");
  //access the object
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  //get all recordds and set to variable
  const getAll = pizzaObjectStore.getAll(); // THis is async

  // upon a successful .getAll() execution, run this function
  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      // if there was data
      fetch("/api/pizzas", {
        method: "POST",
        body: JSON.stringify(getAll.result), //note getAll.result
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json()) //json the response
        .then((serverResponse) => {
          //after you wrote to db
          //then we can work with it
          if (serverResponse.message) {
            throw new Error(serverResponse);
          } // clear all the saved stuff bc its already written

          // open one more transaction
          const transaction = db.transaction(["new_pizza"], "readwrite");
          // access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore("new_pizza");
          // clear all items in your store
          pizzaObjectStore.clear();

          alert("All saved pizza has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

window.addEventListener("online", uploadPizza); // listen for when it goes online
