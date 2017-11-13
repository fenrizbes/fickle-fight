import React, { Component } from 'react';

import Battle from './battle';

class Field extends Component {
    constructor(props) {
        super(props);

        this.battle = null;

        this.state = {
            matrix:   [],
            started:  false,
            fighting: false
        };

        this.handleBattleChange = this.handleBattleChange.bind(this);
    }

    componentDidMount() {
        this._init();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.started !== nextProps.started) {
            this._startedStateUpdated(nextProps.started);
        }

        if (this.state.fighting !== nextProps.fighting) {
            this._fightingStateUpdated(nextProps.fighting);
        }
    }

    handleBattleChange() {
        this.setState({
            matrix: this.battle.getMatrix()
        });

        this.props.onBattleChange(
            this.battle.getTurnNumber(),
            this.battle.getArmies(),
            this.battle.getWinner()
        );
    }

    _init() {
        if (this.battle instanceof Battle) {
            this.battle.stop();
        }

        this.battle = new Battle(this.handleBattleChange);

        this.handleBattleChange();
    }

    _startedStateUpdated(started) {
        this.setState({ started });

        if (!started) {
            this._init();
        }
    }

    _fightingStateUpdated(fighting) {
        this.setState({ fighting });

        if (fighting) {
            this.battle.start();
        } else {
            this.battle.stop();
        }
    }

    render() {
        return (
            <div className="field">
                { this.state.matrix.map((line, i) => (
                    <div key={ 'line-' + i } className="line">
                        { line.map((state, j) => (
                            <div
                                key={ 'line-' + i + '-warrior-' + j }
                                className={ 'warrior state-' + state }
                            />
                        )) }
                    </div>
                )) }
            </div>
        );
    }
}

export default Field;