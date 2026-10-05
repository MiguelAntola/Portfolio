// Cell 1
// Python:
// import numpy as np
// import matplotlib.pyplot as plt
//
// JavaScript does not need imports for the basic random-number
// and visualization logic we are using here.


// Cell 2
function getPositiveNormal(mean, std) {
    let value = -1;

    while (value <= 0) {
        // Equivalent to np.random.normal(mean, std)
        value = normalRandom(mean, std);
    }

    return value;
}


// Helper function for generating a normally distributed random number.
//
// JavaScript's Math.random() generates a uniform random number,
// so we use the Box-Muller transformation to reproduce
// np.random.normal(mean, std).

function normalRandom(mean, std) {
    let u = 0;
    let v = 0;

    while (u === 0) {
        u = Math.random();
    }

    while (v === 0) {
        v = Math.random();
    }

    const z = Math.sqrt(-2.0 * Math.log(u)) *
              Math.cos(2.0 * Math.PI * v);

    return mean + std * z;
}


// Cell 3
function generateRoundBets(bankroll, averageStake, stakeStd) {
    const bets = [];
    let remainingBankroll = bankroll;

    while (remainingBankroll > 0) {
        const bet = getPositiveNormal(
            averageStake,
            stakeStd
        );

        if (bet <= remainingBankroll) {
            bets.push(bet);
            remainingBankroll -= bet;
        } else {
            break;
        }
    }

    return bets;
}


// Cell 4
const startingBankroll = 3000;
const averageStake = 50;
const stakeStd = 15;
const averageROI = 0.05;
const executionProbability = 95 / 100;

const numberOfRounds = 20;
const numberOfSimulations = 10000;


// Cell 5
function resolveBet(stake, executionProbability, averageROI) {
    const randomNumber = Math.random();

    if (randomNumber <= executionProbability) {
        return stake * averageROI;
    } else {
        return -stake * 1;
    }
}


// Cell 6
function playRound(
    bankroll,
    executionProbability,
    averageStake,
    stakeStd,
    averageROI
) {
    const bets = generateRoundBets(
        bankroll,
        averageStake,
        stakeStd
    );

    let roundProfit = 0;

    for (const bet of bets) {
        const outcome = resolveBet(
            bet,
            executionProbability,
            averageROI
        );

        roundProfit += outcome;
    }

    const newBankroll = bankroll + roundProfit;

    return newBankroll;
}


// Cell 7
let bankroll = startingBankroll;

const bankrollHistory = [bankroll];

for (let roundNumber = 0; roundNumber < numberOfRounds; roundNumber++) {

    if (bankroll <= 0) {
        break;
    }

    bankroll = playRound(
        bankroll,
        executionProbability,
        averageStake,
        stakeStd,
        averageROI
    );

    bankrollHistory.push(bankroll);
}


// Cell 8
// In Python this was:
// plt.plot(bankroll_history)
// plt.xlabel("Round")
// plt.ylabel("Bankroll")
// plt.title("Bankroll Over Rounds")
// plt.show()
//
// We will connect this to the HTML visualization later.


// Cell 9
const allSimulations = [];

for (
    let simulationNumber = 0;
    simulationNumber < numberOfSimulations;
    simulationNumber++
) {
    bankroll = startingBankroll;

    const simulationBankrollHistory = [bankroll];

    for (
        let roundNumber = 0;
        roundNumber < numberOfRounds;
        roundNumber++
    ) {
        if (bankroll <= 0) {
            break;
        }

        bankroll = playRound(
            bankroll,
            executionProbability,
            averageStake,
            stakeStd,
            averageROI
        );

        simulationBankrollHistory.push(bankroll);
    }

    allSimulations.push(simulationBankrollHistory);
}


// Cell 10
// In Python:
//
// for simulation in all_simulations:
//     plt.plot(simulation)
//
// plt.xlabel("Round")
// plt.ylabel("Bankroll")
// plt.title(
//     f"{number_of_simulations:,} Simulations "
//     f"of Bankroll Over {number_of_rounds} Rounds"
// )
//
// plt.show()
//
// The JavaScript version will eventually draw these
// simulations onto a chart in index.html.

// Make the simulation results available to index.html.
window.arbitrageSimulation = {
    parameters: {
        startingBankroll,
        averageStake,
        stakeStd,
        averageROI,
        executionProbability,
        numberOfRounds,
        numberOfSimulations
    },
    allSimulations
};
