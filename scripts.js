/*
    * Erika Alexandra Hernández Zurilla
    * 20 de Mayo 2023
    * Microproyecto Sistemas de Información
    * MetroMemory
*/
/* Variables globales */
let playerName = "";
let countdown = 180;
let pairsFound = 0;
let cards = ["pictures/1.jpg", "pictures/2.jpg", "pictures/3.jpg", "pictures/4.jpg", "pictures/5.jpg", "pictures/6.jpg", "pictures/7.jpg", "pictures/8.jpg"];
cards = cards.concat(cards);


/* Mostrar PopUp para registrar nombre */
document.addEventListener('DOMContentLoaded', function() {
   const modal = document.querySelector("#modal");
   modal.showModal();
   updateScoreTable(getScoreData());
});

/* Cerrar PopUp y almacenar */
document.getElementById('myForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita la recarga de la página
    let playerName2 = document.getElementById('nombreInput').value;
    if (playerName2 == "") {
        alert('Por favor, ingresa un nombre válido.');
    } else {
        modal.close();
        startTimer();
        playerName = playerName2;
    }
});

// Llamada al inicio por primera vez del fuejo 
fillCards(cards);

/* Funcionalidad del botón reiniciar juego */
document.getElementById('restartButton').addEventListener("click", function(e) {
            resetGame();
});

/**
 *  Shuffle: Mezcla aleatoria de los elementos de un arreglo (Tarjetas)
 * @param {array} a - Toma el arreglo a tratar
 * @returns {array} - Devuelve el arreglo mezclado
 */

function shuffle(array) {
    let currentIndex = array.length;
    let temporaryCard, randomIndex;
    while (0 !== currentIndex) {
        // Seleccionar un elemento restante
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryCard = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryCard;
    }
    return array;
}

/**
 *  FillCards: Coloca en el tablero las cartas ya mezcladas
 * @param {array} a - Toma el arreglo a tratar
 */

function fillCards(array) {
    shuffle(array);
    let imgElements = document.querySelectorAll(".board img");
    let firstCard = null, secondCard = null;
    let isFlipping = false;
    let timerInterval;
    
    // Se itera sobre las tarjetas en el board 
    for (let i = 0; i < imgElements.length; i++) {
        imgElements[i].addEventListener("click", function() {
            if (this.src.includes("pictures/back.jpg") && !this.classList.contains("flipped") && !isFlipping) {
                let index = Array.from(imgElements).indexOf(this);
                this.src = cards[index];
                this.classList.add("flipped");
                
                if (firstCard === null) {
                    firstCard = this;

                } else {
                    secondCard = this;
                    isFlipping = true;
                    
                    if (firstCard.src !== secondCard.src) {
                        setTimeout(function() {
                            firstCard.src = "pictures/back.jpg";
                            secondCard.src = "pictures/back.jpg";
                            firstCard.classList.remove("flipped");
                            secondCard.classList.remove("flipped");
                            firstCard = null;
                            secondCard = null;
                            isFlipping = false;
                        }, 1000);
                    } else {
                        pairsFound++;
                        if (pairsFound === cards.length / 2) {
                            clearInterval(timerInterval);
                            setTimeout(function() {
                                scorePlayer = parseInt(100 * (countdown / 180));
                                alert("¡Felicidades " + playerName +"! \n ¡Has encontrado todas las parejas!🎉🎉 \n Tu puntuación fue: " + scorePlayer + ".");
                                let scoreData = getScoreData();
                                scoreData.push({ name: playerName, score: scorePlayer });
                                setScoreData(scoreData);
                                updateScoreTable(getScoreData());
                                
                            }, 500);
                        } else {
                            firstCard = null;
                            secondCard = null;
                            isFlipping = false;
                        }
                    }
                }
            }
        });
    }
}

/** StartTimer: Comienza la cuenta regresiva del contador y va modificando el texto del contador con .textContent. */
function startTimer() {
    timerInterval = setInterval(function() {
        countdown --;
        document.getElementById("countdown").textContent = ": "+ countdown;
        
        if (pairsFound== 8 ){
            clearInterval(timerInterval);
            setScoreData(getScoreData()); 
        }
        if (countdown === 0) { 
            alert("Se acabó el tiempo⏳! \n ¡Tienes que ser un poco más rápido la próxima vez 🏃‍♂️!");
            clearInterval(timerInterval);
            resetGame();
        }
    }, 1000); // 1000 equivale a 1 segundo. 
}

/** ResetGame: Reinicia el juego. */
function resetGame() {
    // Actualizamos las variables globales.
    clearInterval(timerInterval);
    startTimer();
    pairsFound = 0;
    countdown = 180;

    let imgElements = document.querySelectorAll(".board img");
    document.getElementById("countdown").textContent = countdown;
    for (let i = 0; i < imgElements.length; i++) {
        // Tapamos nuevamente las tarjetas
        imgElements[i].src = "pictures/back.jpg";
        imgElements[i].classList.remove("flipped");
    }
    shuffle(cards);
    fillCards(cards);
}

/**
 * UpdateScoreTable: Actualiza las puntaciones en la tabla de Top Ranking de Jugadores
 * @param {scoreDate} a - Json de Jugadores del LocalStorage
 */

function updateScoreTable(scoreData) {
    // Sort descendente del Json 
    scoreData.sort(function (a, b) {
      return b.score - a.score;
    });
    
    // Se vacía la tabla
    let tableBody = document.querySelector(".scoreTable tbody");
    tableBody.innerHTML = "";
  
    // Se itera el TOP 10 para llenar la tabla. 
    for (var i = 0; i < 10 && i < scoreData.length; i++) {
      var scoreJson = scoreData[i];
      var row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${scoreJson.name}</td>
        <td>${scoreJson.score}</td>
      `;
      tableBody.appendChild(row);
    }
  }

 /**
 * GetScoreData: GETTER Obtener el diccionario (Json) del localStorage de puntuación.
 * @returns {scoreData} - Diccionario de puntuación Ranking jugadores.
 */
function getScoreData() {
    let scoreData = JSON.parse(localStorage.getItem("scoreData"));
    if (!scoreData) {
      scoreData = [
        {name: "Erika Hernández", score: 97}, ];
    }
    return scoreData;
  }

  /**
 * SetScoreData: SETTER Almacenar nuevamente el scoreData modificado en el localStorage. 
 * @param {scoreData} a - Json de Puntación TOP Ranking Jugadores. 
 */
function setScoreData(scoreData) {
    localStorage.setItem("scoreData", JSON.stringify(scoreData));
  }  