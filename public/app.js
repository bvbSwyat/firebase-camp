const auth = firebase.auth();

const noUser = document.getElementById('noUser');
const signedUser = document.getElementById('signedUser');

const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

loginBtn.onclick = () => {
    return auth.signInWithPopup(provider);
}

logoutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged((user) => {
  if (user) {
    signedUser.hidden = false;
    noUser.hidden = true;
    userDetails.innerHTML = `<h3>User Details: ${user.displayName}`;
  } else {
    signedUser.hidden = true;
    noUser.hidden = false;
    userDetails.innerHTML = '';
  }
});

const db = firebase.firestore();

const todoBtn = document.getElementById('todo');
const todo = document.getElementById('text');
const todoList = document.getElementById('todoList');

let todoRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
    if (user) {     
        todoRef = db.collection('todos');

        unsubscribe = todoRef
        .where('uid', '==', user.uid)
        .onSnapshot(querySnapshot => {
            const todos = querySnapshot.docs.map((item) => {
                return `<p>${ item.data().todo }</p>`
            });
            todoList.innerHTML = todos.join('');
        });

        todoBtn.onclick = () => {
            const newTodo = todo.value;
            const { serverTimestamp } = firebase.firestore.FieldValue;

            if (newTodo.length) {
                todoRef.add({
                    uid: user.uid,
                    todo: newTodo,
                    createAt: Date.now()
                })
                todo.value = '';
            }
        }
    } else {
        unsubscribe && unsubscribe();
    }
});

