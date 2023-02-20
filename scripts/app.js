/**
 * Runs the whole game
 */
const runGame = (() => {
    /*** Beginning of Variabe Declarations ***/
    let turn = 'x';
    let mode = 'player';
    const winnerBox = document.querySelector('.winner-box');
    const annoucementText = document.querySelector('.announcement');
    const winnerIndicator = winnerBox.querySelector('.winner');
    const gameGrid = document.querySelector('.game-grid');
    const header = document.querySelector('header');
    const gameOption = document.querySelector('.game-option');
    const reloadBtn = document.querySelector('.reload');
    const pickers = document.querySelectorAll('.picker');
    const quitAndNextRoundBtns = document.querySelectorAll('.btn-container button');
    /***End of variable declarations ***/


    /***Reload begin
     * ---Reloads the page on clicking the button
     */
    reloadBtn.addEventListener('click', ()=> {
        window.location.reload();
    })
    /***Reload End ***/

    /***
     * works while palying the game
     * either to quit or to go to the next 
     * round of the game 
    ***/
    quitAndNextRoundBtns.forEach(btn => {
        btn.addEventListener('click', (e)=> {
            const target = e.currentTarget;
            if (target.classList.contains('quit')) {
                flow.clearBoxes();
                winnerBox.classList.add('hide-winner-box');
                gameGrid.classList.add('hide-grid');
                gameOption.classList.remove('hide-option');
                document.querySelector('.logos .x-logo.picker').classList.add('active');
                document.querySelector('.logos .o-logo.picker').classList.remove('active');
                annoucementText.textContent = '';
            } else {
                flow.clearBoxes();
                winnerBox.classList.add('hide-winner-box');
                annoucementText.textContent = '';
            }
        })
    })
    /***End of Quit And Next ***/

    /** 
     * To determine which move the player wants to make first 
    **/
    const pickPlayer = ()=> {
        pickers.forEach(btn => {
            btn.addEventListener('click', (e)=> {
                pickers.forEach(item => {
                    item.classList.remove('active');
                })
                const target = e.currentTarget;
                target.classList.add('active');
                turn = target.textContent;
                if (turn === 'o') {
                    document.querySelector('.game-grid .score-board .score-x ').style.order = 3;
                    document.querySelector('.game-grid .score-board .score-x p span').textContent = `(CPU)`;
                    document.querySelector('.game-grid .score-board .score-o ').style.order = 1;
                    document.querySelector('.game-grid .score-board .score-o p span').textContent = `(YOU)`;
                    document.querySelector('.game-grid .score-board .score-tie ').style.order = 2;
                }
            })
        })
    }
    /***End of Pick Player ***/

    /*** The winining board created in a modular pattern matter***/
    const gameBoard = (()=> {
        const board =  [
            [0, 1, 2],
            [0, 3, 6],
            [0, 4, 8],
            [6, 7, 8],
            [2, 5, 8],
            [2, 4, 6],
            [3, 4, 5],
            [1, 4, 7]
        ];
        return {board};
    })();
    /***End of Game Board ***/

    /***
    * Determines which mode the player wants to go
    * Either with another player or with the CPU
    * Returns - a mode object
    ***/
    const selectMode = () => {
        const btns = document.querySelectorAll('.game-option > button');
        btns.forEach(btn => {
            btn.addEventListener('click', (e)=> {
                gameGrid.classList.remove('hide-grid');
                header.classList.remove('hide-head');
                gameOption.classList.add('hide-option');
                if (e.currentTarget.classList.contains('cpu-btn')) {
                    mode = 'cpu';
                } else {
                    mode = 'player';
                }
            })
        })
        return {mode};
    };
    /***End of Select Mode ***/

    /*** 
     *Determines the winner after moves made by each of the players
     * Returns - a boolean object 
     ***/
    const decideWinner = ()=> {
        let val = 'false';
        val =  gameBoard.board.some(item => {
            return item.every(elem => flow.boxes[elem].textContent == turn);
        });
        return {val};
    };
    /***End of Decide Winner ***/

    /**
     * Changes the turn at after any of the player has made a move
     * @returns Nothings
     */
    const changeTurn = () => {
        turn = turn  == 'x' ? 'o' : 'x';
    }
    /**End of Change turn **/

    /**
     * controls the flower of the game
     * @returns objects of functions and variables that are reusable
     */
    const flowController = () => {
        const boxes = document.querySelectorAll('.game-grid .boxes-container .box');
        /**
         * 
         * @returns The boxes that are empty in an array form
         */
        const remainingBoxes = () => {
            let remArr = [];
            for (let i = 0; i < boxes.length; i++) {
                if (boxes[i].textContent == '') {
                    remArr.push(i);
                }
            }
            return remArr;
        }
        /** End of Remaining Arr */

        /**
         * Disables boxes when playing in the CPU mode
         * Disable boxes immediately after the player has made a move
         * This is to prevent the player from making another move immediately
         * @returns Nothing
         */
        const disableBoxes = () => {
            let spareBoxes = remainingBoxes();
            for (let i = 0; i < spareBoxes.length; i++) {
                boxes[spareBoxes[i]].style.pointerEvents = 'none';
            }
        }
        /**End of Disable Boxes **/

          /**
         * Enables boxes when playing in the CPU mode
         * Enables boxes immediately after the CPU has made a move
         * This is to enable the player to make anothe move immediately after the CPU has made a move
         * @returns Nothing
         */
        const enableBoxes = () => {
            let spareBoxes = remainingBoxes();
            for (let i = 0; i < spareBoxes.length; i++) {
                boxes[spareBoxes[i]].style.pointerEvents = '';
            }
        }
        /**End of Enable Boxes **/

        /**
         * Clears the content of the boxes on completing a round
         * Or on quitting the game
         * @returns Nothing
         */
        const clearBoxes = () => {
            boxes.forEach(box => {
                box.textContent = '';
                box.style.pointerEvents = '';
            })
        }
        /**End of Clear Boxes **/
        return {boxes, remainingBoxes,disableBoxes, enableBoxes, clearBoxes};
    }
    /** End of Flow Controller **/

    /**
     * Controls the functionality of the games
     * Responsilble for the controls of both players
     * @returns an object of player1 and player2 moves
     */
    const playGame = () => {
        const playerOne = () => {
            flow.boxes.forEach(item=> {
                item.addEventListener('click', (e) => {
                    e.target.textContent = turn;
                    e.target.style.pointerEvents = 'none';
                    if (flow.remainingBoxes().length === 0 && !decideWinner().val) {
                        winnerBox.classList.remove('hide-winner-box');
                        winnerIndicator.textContent = 'TIE';
                        annoucementText.textContent = 'tie'
                        document.querySelector(`.score-tie .count`).textContent++;   
                    }
                    else {
                        if (decideWinner().val) {
                            winnerBox.classList.remove('hide-winner-box');
                            winnerIndicator.textContent = `${turn} takes the round`;
                            document.querySelector(`.score-${turn} .count`).textContent++;
                        }
                        else {
                            changeTurn();
                            if (selectMode().mode === 'cpu') {
                                flow.disableBoxes();
                                playerTwo();
                                flow.enableBoxes();
                                if (decideWinner().val) {
                                    annoucementText.textContent = 'you lost';
                                    winnerBox.classList.remove('hide-winner-box');
                                    winnerIndicator.textContent = `${turn} takes the round`;
                                    document.querySelector(`.score-${turn}.count`).textContent++;
                                }
                                changeTurn();
                            }
                        }
                    }
                }) 
            })
        }
        const playerTwo = () => {
            let avalaibleBoxes = flow.remainingBoxes();
            let randomBox = avalaibleBoxes[Math.floor(Math.random() * avalaibleBoxes.length)];
            if (avalaibleBoxes.length > 0) {
                flow.boxes[randomBox].textContent = turn;
            }
        }
        return {playerOne, playerTwo};
    }
    /**
     * End of Play Game
     */
    const flow = flowController();
    const startGame = playGame();
    startGame.playerOne();
    selectMode();
    pickPlayer();
})();