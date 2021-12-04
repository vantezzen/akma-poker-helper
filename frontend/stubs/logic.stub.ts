import MQTT from 'async-mqtt';

const mqtt = MQTT.connect('mqtt://test.mosquitto.org');

const sendTestData = async () => {

  console.log("Starting");
  try {
    await mqtt.publish("akma/poker/logic", JSON.stringify({
      "player": [{
        "name": "Player #1",
        "ranks": [{
          "name": "Royal Flush",
          "percentage": 0
        }, {
          "name": "Straight Flush",
          "percentage": 0
        }, {
          "name": "4 of a kind",
          "percentage": 4.878048780487805
        }, {
          "name": "Full House",
          "percentage": 32.073170731707314
        }, {
          "name": "Flush",
          "percentage": 1.8292682926829267
        }, {
          "name": "Straight",
          "percentage": 0
        }, {
          "name": "3 of a kind",
          "percentage": 61.21951219512195
        }, {
          "name": "Two Pairs",
          "percentage": 0
        }, {
          "name": "One Pair",
          "percentage": 0
        }, {
          "name": "High Card",
          "percentage": 0
        }],
        "pokerScore": 51.9390243902439,
        "isWinner": false
      }, {
        "name": "Player #2",
        "ranks": [{
          "name": "Royal Flush",
          "percentage": 4.878048780487805
        }, {
          "name": "Straight Flush",
          "percentage": 0
        }, {
          "name": "4 of a kind",
          "percentage": 0
        }, {
          "name": "Full House",
          "percentage": 0
        }, {
          "name": "Flush",
          "percentage": 95.1219512195122
        }, {
          "name": "Straight",
          "percentage": 0
        }, {
          "name": "3 of a kind",
          "percentage": 0
        }, {
          "name": "Two Pairs",
          "percentage": 0
        }, {
          "name": "One Pair",
          "percentage": 0
        }, {
          "name": "High Card",
          "percentage": 0
        }],
        "pokerScore": 61.95121951219512,
        "isWinner": false
      }, {
        "name": "Player #3",
        "ranks": [{
          "name": "Royal Flush",
          "percentage": 0
        }, {
          "name": "Straight Flush",
          "percentage": 0.24390243902439024
        }, {
          "name": "4 of a kind",
          "percentage": 0
        }, {
          "name": "Full House",
          "percentage": 0
        }, {
          "name": "Flush",
          "percentage": 99.7560975609756
        }, {
          "name": "Straight",
          "percentage": 0
        }, {
          "name": "3 of a kind",
          "percentage": 0
        }, {
          "name": "Two Pairs",
          "percentage": 0
        }, {
          "name": "One Pair",
          "percentage": 0
        }, {
          "name": "High Card",
          "percentage": 0
        }],
        "pokerScore": 60.073170731707314,
        "isWinner": false
      }, {
        "name": "Player #4",
        "ranks": [{
          "name": "Royal Flush",
          "percentage": 0
        }, {
          "name": "Straight Flush",
          "percentage": 0
        }, {
          "name": "4 of a kind",
          "percentage": 0
        }, {
          "name": "Full House",
          "percentage": 0
        }, {
          "name": "Flush",
          "percentage": 1.8292682926829267
        }, {
          "name": "Straight",
          "percentage": 19.634146341463417
        }, {
          "name": "3 of a kind",
          "percentage": 0.975609756097561
        }, {
          "name": "Two Pairs",
          "percentage": 5.731707317073171
        }, {
          "name": "One Pair",
          "percentage": 39.268292682926834
        }, {
          "name": "High Card",
          "percentage": 32.5609756097561
        }],
        "pokerScore": 24.134146341463413,
        "isWinner": false
      }]
    }));
    await mqtt.end();
    console.log("Done");
  } catch (e) {
    // Do something about it!
    console.log(e.stack);
    process.exit();
  }
}

mqtt.on("connect", sendTestData);