import React, { Component } from 'react';

import {
    ARMY_SIZE,
    NO_ARMY,
    BLUE_ARMY,
    RED_ARMY,
    ARMY_TITLES
} from './constants';

import Field from './field';

class App extends Component {
    constructor() {
        super();

        this.state = {
            started:  false,
            fighting: false,
            turn:     0,
            winner:   null,
            armies:   {
                [BLUE_ARMY]: ARMY_SIZE,
                [RED_ARMY]:  ARMY_SIZE
            }
        };

        this.handleFightToggle  = this.handleFightToggle.bind(this);
        this.handleResetClick   = this.handleResetClick.bind(this);
        this.handleBattleChange = this.handleBattleChange.bind(this);
    }

    handleFightToggle() {
        this.setState({
            started:  true,
            fighting: !this.state.fighting
        });
    }

    handleResetClick() {
        this.setState({
            started:  false,
            fighting: false,
            turn:     0,
            winner:   null
        });
    }

    handleBattleChange(turn, armies, winner) {
        this.setState({
            turn,
            armies,
            winner
        });
    }

    render() {
        return (
            <div>
                <div className="controls">
                    { null === this.state.winner ?
                        <button onClick={ this.handleFightToggle }>
                            { this.state.started ?
                                (this.state.fighting ? 'Pause' : 'Continue')
                            :
                                'Fight!'
                            }
                        </button>
                    : null }

                    { this.state.started ?
                        <button onClick={ this.handleResetClick }>
                            Reset
                        </button>
                    : null }
                </div>

                <Field
                    started={ this.state.started }
                    fighting={ this.state.fighting }
                    onBattleChange={ this.handleBattleChange }
                />

                <div className="scoreboard">
                    { null === this.state.winner ?
                        [
                            <div key="blue" className="blue">
                                { this.state.armies[BLUE_ARMY] }/{ ARMY_SIZE }
                            </div>,
                            <div key="turn">
                                Turn: { this.state.turn }
                            </div>,
                            <div key="red" className="red">
                                { this.state.armies[RED_ARMY] }/{ ARMY_SIZE }
                            </div>
                        ]
                    :
                        <div>
                            Winner:
                            { NO_ARMY === this.state.winner ?
                                ' Death'
                            :
                                ' ' + ARMY_TITLES[this.state.winner] + ' Army'
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default App;
