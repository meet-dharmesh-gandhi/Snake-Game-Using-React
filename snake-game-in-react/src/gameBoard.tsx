import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import GameSquare from "./boardSquare.tsx";
import "./gameBoard.css";

export default function GameBoard(): React.ReactElement {

    const [snakePos, setSnakePos] = useState<Array<Array<number>>>([[3, 3], [3, 4], [3, 5]]);
    const [applePos, setApplePos] = useState(generateRandomApples(5, 30));
    const snakeDirection = useRef<"up" | "down" | "left" | "right">("right");
    const snakeMoved = useRef<"not moved" | "moved">("not moved")
    const intervalId = useRef<any>(null);
    const snakeSpeed: number = 0.5; // in milliseconds

    function generateRandomApples(numberOfApples: number, maxLimit: number): Array<Array<number>> {
        let newApplePos: Array<Array<number>> = [];
        for (let i = 0; i < numberOfApples; i++) {
            newApplePos.push([Math.floor(Math.random() * maxLimit), Math.floor(Math.random() * maxLimit)]);
        }
        return newApplePos;
    }

    function getNewApplePos(maxLimit: number, existingApples: Array<Array<number>>): Array<number> {
        let newApplePos: Array<number> = [Math.floor(Math.random() * maxLimit), Math.floor(Math.random() * maxLimit)];
        while (existingApples.some((apple) => apple[0] === newApplePos[0] && apple[1] === newApplePos[1])) {
            newApplePos = [Math.floor(Math.random() * maxLimit), Math.floor(Math.random() * maxLimit)];
        }
        return newApplePos;
    }

    function increaseSnakeSize(): Array<Array<number>> {
        const newSnakePos = [...snakePos];
        const lastSegment = newSnakePos[newSnakePos.length - 1];
        const secondLastSegment = newSnakePos[newSnakePos.length - 2];
        if (lastSegment[0] - secondLastSegment[0] < 0) {
            newSnakePos.push([lastSegment[0] - 1, lastSegment[1]])
        } else if (lastSegment[0] - secondLastSegment[0] > 0) {
            newSnakePos.push([lastSegment[0] + 1, lastSegment[1]])
        } else if (lastSegment[1] - secondLastSegment[1] < 0) {
            newSnakePos.push([lastSegment[0], lastSegment[1] - 1])
        } else if (lastSegment[1] - secondLastSegment[1] > 0) {
            newSnakePos.push([lastSegment[0], lastSegment[1] + 1])
        }
        return newSnakePos;
    }

    function appleEaten(snakeCoords: Array<number>): Array<Array<number>> {
        for (let i = 0; i < applePos.length; i++) {
            if (applePos[i][0] === snakeCoords[0] && applePos[i][1] === snakeCoords[1]) {
                console.log("Apple Found!!!");
                setApplePos([...applePos.slice(0, i), getNewApplePos(30, applePos), ...applePos.slice(i + 1)]);
                return increaseSnakeSize();
            }
        }
        return snakePos;
    }

    function checkSnakeCollision(headCoords: Array<number>) {
        if (snakePos.some(element => JSON.stringify(element) === JSON.stringify(headCoords))) {
            return true;
        }
        return false;
    }

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "ArrowRight" && snakeDirection.current !== "left") {
                snakeDirection.current = "right";
                snakeMoved.current = "moved";
            } else if (e.key === "ArrowLeft" && snakeDirection.current !== "right") {
                snakeDirection.current = "left";
                snakeMoved.current = "moved";
            } else if (e.key === "ArrowDown" && snakeDirection.current !== "up") {
                snakeDirection.current = "down";
                snakeMoved.current = "moved";
            } else if (e.key === "ArrowUp" && snakeDirection.current !== "down") {
                snakeDirection.current = "up";
                snakeMoved.current = "moved";
            }
        }

        intervalId.current = setInterval(() => {
            let newSnakePos: Array<Array<number>> = [...snakePos];
            const x: number = newSnakePos[snakePos.length - 1][0], y: number = newSnakePos[snakePos.length - 1][1];
            if (snakeDirection.current === "right" && snakeMoved.current === "moved" && y + 1 < 30 && !checkSnakeCollision([x, y + 1])) {
                newSnakePos = appleEaten([x, y + 1]);
                newSnakePos.push([x, y + 1]);
                newSnakePos.splice(0, 1);
                snakeMoved.current = "not moved";
            } else if (snakeDirection.current === "left" && snakeMoved.current === "moved" && y - 1 > -1 && !checkSnakeCollision([x, y - 1])) {
                newSnakePos = appleEaten([x, y - 1]);
                newSnakePos.push([x, y - 1]);
                newSnakePos.splice(0, 1);
                snakeMoved.current = "not moved";
            } else if (snakeDirection.current === "up" && snakeMoved.current === "moved" && x - 1 > -1 && !checkSnakeCollision([x - 1, y])) {
                newSnakePos = appleEaten([x - 1, y]);
                newSnakePos.push([x - 1, y]);
                newSnakePos.splice(0, 1);
                snakeMoved.current = "not moved";
            } else if (snakeDirection.current === "down" && snakeMoved.current === "moved" && x + 1 < 30 && !checkSnakeCollision([x + 1, y])) {
                newSnakePos = appleEaten([x + 1, y]);
                newSnakePos.push([x + 1, y]);
                newSnakePos.splice(0, 1);
                snakeMoved.current = "not moved";
            }

            setSnakePos(newSnakePos);

        }, snakeSpeed);

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            if (intervalId.current !== null) {
                clearInterval(intervalId.current);
            }
        }
    }, [snakeDirection, snakePos]);

    function createRow(n: number, rowNumber: number) {
        let row: Array<React.ReactElement> = [];
        for (let i = 0; i < n; i++) {
            let role = snakePos.some(element => JSON.stringify(element) === JSON.stringify([i, rowNumber]) && element === snakePos[snakePos.length - 1]) ? "Snake Head" : snakePos.some(element => JSON.stringify(element) === JSON.stringify([i, rowNumber])) ? "Snake" : applePos.some(element => JSON.stringify(element) === JSON.stringify([i, rowNumber])) ? "Apple" : "Grass";
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