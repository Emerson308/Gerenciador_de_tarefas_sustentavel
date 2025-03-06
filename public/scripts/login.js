const form = document.getElementById("formLogin");
const mensagemDiv = document.getElementById("mensagemVerificacao");

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const dados = Object.fromEntries(formData.entries());
    // console.log(dados)

    try {
        const response = await fetch('/salvar-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (resultado.success){
            if (mensagemDiv.classList.contains("fail")){
                mensagemDiv.classList.remove("fail");
            }
            mensagemDiv.classList.add("sucess");
            mensagemDiv.textContent = "Login realizado!";
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000)
        }else{
            if (mensagemDiv.classList.contains("sucess")){
                mensagemDiv.classList.remove("sucess");
            }
            mensagemDiv.classList.add("fail");
            mensagemDiv.textContent = resultado.message;
        }
    } catch (error){
        mensagemDiv.classList.add("fail")
        mensagemDiv.textContent = "Erro na conexão com o servidor";
    }
});