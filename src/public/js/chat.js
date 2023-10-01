const socketClient = io();

const chatbox = document.getElementById("chatbox");
const chat = document.getElementById("messageLogs");

let user;

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Dirección de email para el chat",
    inputValidator: (value) => {
        if (!value) {
            return "La dirección de email es obligatoria.";
        }
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    socketClient.emit("authenticated", `Usuario ${ user } ha iniciado sesión.`)
});

chatbox.addEventListener("keyup", (e) => {
    //console.log(e.key);
    if (e.key === "Enter") {
        if(chatbox.value.trim().length > 0) {
            socketClient.emit("message", {user: user, message: chatbox.value});
            chatbox.value = "";
        }
    }
});

socketClient.on("messageHistory", (serverData) => {
    let elmMessages = "";
    serverData.forEach( item => {
        elmMessages = elmMessages + `${ item.user }: ${ item.message } <br />`;
    });
    chat.innerHTML = elmMessages;
});

socketClient.on("newUser", (data) => {
    if (user) {
        Swal.fire({
            text: data,
            toast: true,
            position: "top-right"
        });
    }
});