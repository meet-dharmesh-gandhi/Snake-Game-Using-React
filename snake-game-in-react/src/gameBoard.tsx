import React, { useEffect, useState } from "react";
import GameSquare from "./boardSquare.tsx";
import "./gameBoard.css";

export default function GameBoard(): React.ReactElement {

    function generateRandomApples(numberOfApples: number, maxLimit: number): Array<Array<number>> {
        let newApplePos: Array<Array<number>> = [];
        for (let i = 0; i < numberOfApples; i++) {
            newApplePos.push([Math.floor(Math.random() * maxLimit), Math.floor(Math.random() * maxLimit)]);
        }
        return newApplePos;
    }

    const [snakePos, setSnakePos] = useState([[3, 3], [3, 4]]);
    const [applePos, setApplePos] = useState(generateRandomApples(5, 30));

    useEffect(() => {

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "ArrowRight") {
                let newSnakePos = [...snakePos];
                newSnakePos.push([newSnakePos[snakePos.length - 1][0], newSnakePos[snakePos.length - 1][1] + 1]);
                newSnakePos.splice(0, 1);
                setSnakePos(newSnakePos);
            }
        }

        // i want the snake to move on keypress. if i press right, the snakePos list should append/push a new element and remove the first element
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, []);

    function createRow(n: number, rowNumber: number) {
        let row: Array<React.ReactElement> = [];
        for (let i = 0; i < n; i++) {
            let role = snakePos.some(element => JSON.stringify(element) === JSON.stringify([i, rowNumber])) ? "Snake" : applePos.some(element => JSON.stringify(element) === JSON.stringify([i, rowNumber])) ? "Apple" : "Grass";
            row.push(
                <div key={i}>
                    {React.createElement(GameSquare, { role })}
                </div>
            );
        }
        return row;
    }

    function createSquares(rows: number) {
        let grid: Array<React.ReactElement> = [];
        for (let i = 0; i < rows; i++) {
            grid.push(
                <div key={i + rows}>
                    {createRow(rows, i)}
                </div>
            );
        }
        return grid;
    }

    return (
        <div className="gameBoard">
            {createSquares(30)}
        </div>
    );
}