const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

//Lista Carrinho
let cart = [];

//Abrir o modal do Carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

//Fechar o modal quando clciar fora
cartModal.addEventListener("click",function(event){
    if(event.target === cartModal){
        cartModal.style.display ="none"
    }
})

//Fechar quando clicar em fechar
closeModalBtn.addEventListener("click",function(){
    cartModal.style.display ="none"
})

//Pegando os elementos 
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name,price);
    }
})

//Função para Adiconar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;

    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal();
}

//Atualiza o Carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML =`
            <div class="flex items-center justify-between">
                <div>
                    <P class="font-medium">${item.name}</p>
                    <P>Qtde: ${item.quantity}</p>
                    <P class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//Função para Remover Item
cartItemsContainer.addEventListener("click",function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

//Função para Remover Do Carrinho
function removeItemCart(name){
    const index = cart.findIndex(item=> item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal()
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

//Pegando o input de endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar o Carrinho
checkoutBtn.addEventListener("click", function(){
    //Checanddo se está aberto e barrando a finalização do Pedido
    const isOpen = checkShopOpen();
    if(!isOpen){
        Toastify({
            text: "O restaurante esta Fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style:{background: "#ef4444"}, 
        }).showToast();

        return;
    }

    if(cart.length === 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedio para Whats
    const cartItems = cart.map((item) =>{
        return(
            `${item.name} Quantidade: (${item.quantity} Preço: R$${item.price}) |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "41999826714"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

//Verificar se A loja está aberta
function checkShopOpen(){
    const data = new Date();
    const hora = data.getHours;
    return hora >= 18 && hora < 22;//True Aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkShopOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-500")
} else{
    spanItem.classList.remove("bg-green-500")
    spanItem.classList.add("bg-red-600")
}
