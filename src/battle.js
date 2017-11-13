import {
    NO_ARMY,
    BLUE_ARMY,
    RED_ARMY,
    FIELD_SIZE,
    ARMY_SIZE,
    TURN_DURATION,
    NORMAL_ODD,
    SMALL_ODD,
    RARE_ODD
} from './constants';

class Battle {
    constructor(onChange) {
        this.onChange = onChange;
        this.matrix   = [];
        this.timer    = null;
        this.turn     = 0;
        this.armies   = {
            [BLUE_ARMY]: ARMY_SIZE,
            [RED_ARMY]:  ARMY_SIZE
        };

        this._turn = this._turn.bind(this);

        this._buildMatrix();
    }

    getMatrix() {
        return this.matrix;
    }

    getArmies() {
        return this.armies;
    }

    getTurnNumber() {
        return this.turn;
    }

    getWinner() {
        if (0 === this.armies[BLUE_ARMY] && 0 === this.armies[RED_ARMY]) {
            return NO_ARMY;
        }

        if (0 === this.armies[BLUE_ARMY]) {
            return RED_ARMY;
        }

        if (0 === this.armies[RED_ARMY]) {
            return BLUE_ARMY;
        }

        return null;
    }

    start() {
        this._nextTurn();
    }

    stop() {
        clearTimeout(this.timer);
    }

    _buildMatrix() {
        for (let line = 0; line < FIELD_SIZE; line++) {
            this.matrix[line] = [];

            for (let column = 0; column < FIELD_SIZE; column++) {
                this.matrix[line][column] = NO_ARMY;
            }
        }

        this._buildArmy(BLUE_ARMY);
        this._buildArmy(RED_ARMY);
    }

    _buildArmy(army) {
        for (let line = 0; line < FIELD_SIZE; line++) {
            const columns = ARMY_SIZE / FIELD_SIZE;

            for (let column = 0; column < columns; column++) {
                const col = (BLUE_ARMY === army ? column : FIELD_SIZE - column - 1);

                this.matrix[line][col] = army;
            }
        }
    }

    _nextTurn() {
        this.timer = setTimeout(this._turn, TURN_DURATION);
    }

    _turn() {
        this.turn++;

        const steps = FIELD_SIZE / 2;

        for (let step = 0; step < steps; step++) {
            this._step(step);
        }

        this.onChange();

        if (null === this.getWinner()) {
            this._nextTurn();
        }
    }

    _step(step) {
        const left    = FIELD_SIZE / 2 - step - 1;
        const right   = FIELD_SIZE / 2 + step;
        const columns = (this._chance(NORMAL_ODD) ? [left, right] : [right, left]);

        columns.forEach(column => {
            for (let line = 0; line < FIELD_SIZE; line++) {
                this._action(line, column);
            }
        });
    }

    _action(line, column) {
        const army = this.matrix[line][column];

        if (NO_ARMY === army) {
            return;
        }

        if (this._attack(army, line, column)) {
            return;
        }

        this._move(army, line, column);
    }

    _attack(army, line, column) {
        const checks = [
            [line, column - 1],
            [line, column + 1],
            [line - 1, column],
            [line + 1, column]
        ];

        for (let i in checks) {
            if (this._isEnemy(army, checks[i][0], checks[i][1])) {
                this._fight(line, column, checks[i][0], checks[i][1]);

                return true;
            }
        }

        return false;
    }

    _isEnemy(thisArmy, line, column) {
        if (
            'undefined' === typeof this.matrix[line]
            ||
            'undefined' === typeof this.matrix[line][column]
        ) {
            return false;
        }

        const thatArmy = this.matrix[line][column];

        return (NO_ARMY !== thatArmy && thisArmy !== thatArmy);
    }

    _fight(thisLine, thisColumn, thatLine, thatColumn) {
        if (this._chance(RARE_ODD)) {
            this._kill(thisLine, thisColumn);
            this._kill(thatLine, thatColumn);
        } else if (this._chance(SMALL_ODD)) {
            return;
        }

        if (this._chance(NORMAL_ODD)) {
            this._kill(thatLine, thatColumn);
        } else {
            this._kill(thisLine, thisColumn);
        }
    }

    _kill(line, column) {
        const army = this.matrix[line][column];

        this.armies[army]--;

        this.matrix[line][column] = NO_ARMY;
    }

    _move(army, line, column) {
        const enemy = this._findEnemy(army, line, column);

        if (null !== enemy) {
            this._moveTowards(line, column, enemy[0], enemy[1]);
        }
    }

    _findEnemy(army, line, column) {
        for (let offset = 0; offset < FIELD_SIZE; offset++) {
            const lns = [line - offset, line + offset];

            for (let i in lns) {
                for (let cl = column; cl >= 0; cl--) {
                    if (this._isEnemy(army, lns[i], cl)) {
                        return [lns[i], cl];
                    }
                }

                for (let cl = column + 1; cl < ARMY_SIZE; cl++) {
                    if (this._isEnemy(army, lns[i], cl)) {
                        return [lns[i], cl];
                    }
                }
            }
        }

        return null;
    }

    _moveTowards(thisLine, thisColumn, thatLine, thatColumn) {
        if (thisLine !== thatLine) {
            let targetLine;

            if (thisLine - thatLine < 0) {
                targetLine = thisLine + 1;
            } else {
                targetLine = thisLine - 1;
            }

            if (NO_ARMY === this.matrix[targetLine][thisColumn]) {
                this.matrix[targetLine][thisColumn] = this.matrix[thisLine][thisColumn];
                this.matrix[thisLine][thisColumn]   = NO_ARMY;

                return;
            }
        }

        if (thisColumn !== thatColumn) {
            let targetColumn;

            if (thisColumn - thatColumn < 0) {
                targetColumn = thisColumn + 1;
            } else {
                targetColumn = thisColumn - 1;
            }

            if (NO_ARMY === this.matrix[thisLine][targetColumn]) {
                this.matrix[thisLine][targetColumn] = this.matrix[thisLine][thisColumn];
                this.matrix[thisLine][thisColumn]   = NO_ARMY;
            }
        }
    }

    _chance(odd) {
        return (Math.random() < odd);
    }
}

export default Battle;