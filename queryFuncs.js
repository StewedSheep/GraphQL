
import {
  objectById
} from "./query.js";
export function chartData(transactionData) {
  const obj = {}
  obj.data = new Array
  let data = {}
  transactionData.transaction.forEach((transaction) => {
    const day = transaction.dayFrom.fday
    const amount = transaction.amount
    const objId = transaction.objectId
    data = {
      "createdAt": transaction.createdAt,
      "amount": amount,
      "objId": objId,
      "day": day,
    }
    //add data to obj
    obj.data.push(data)
  })
  obj.data.forEach(async (data) => {
    data.objId = await getObjectName(data.objId)
  })
  return obj;
}
async function getObjectName(objectId) {
  return new Promise((resolve, reject) => {
    getData(objectById(objectId), localStorage.getItem("jwt"))
      .then((data) => {
        const objectName = data.object[0].name;
        resolve(JSON.stringify(objectName));
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export function convertCreatedAtToNewFormat(transactionData) {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    return transactionData.map((transaction) => {
      const createdAt = new Date(transaction.createdAt);
  
      const day = createdAt.getDate();
      const month = monthNames[createdAt.getMonth()];
      const fday = `${month} ${day}`;
      const year = createdAt.getFullYear();
      const time = createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  
      return { ...transaction, dayFrom: { fday, year, time } };
    });
  }
  
  export function convertDataToSkillData(transactionData) {
    const obj = {}
  
    transactionData.transaction.forEach(element => {
      const result = element.type.replace(/^skill_/, "");
      if (obj[result] == null || obj[result] < element.amount) {
        obj[result] = element.amount
      };
    });
    const mapArray = [[], [], []]
    for (const [key, value] of Object.entries(obj)) {
      const result = key.replace(/_/g, " ");
      if (value > 0) {
        mapArray[0].push(result)
        mapArray[1].push(value)
        mapArray[2].push(getRandomColor())
      }
    }
    return mapArray
  }
  
  export function findInfo(data) {
    const obj = []
    data.user.forEach(element => {
      const date = new Date(element.attrs.dateOfBirth);
      const options = {
        year: "numeric",
        month: "short",
        day: "2-digit"
      };
  
      const formattedDate = date.toLocaleDateString("en-US", options)
      const payload = {
        "email": element.attrs.email,
        "img": element.attrs.image,
        "firstname": element.attrs.firstName,
        "surname": element.attrs["lastName"],
        "dateOfBirth": formattedDate,
        "auditRatio": element.auditRatio.toFixed(1),
      }
      obj.push(payload)
    })
    return obj
  }
  
  // Function to generate a random RGB color
  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256); 
    const alpha = Math.random();
     // Return the RGBA color string
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  export function expChart(ndata, dayAmount) {
  
    const chart = document.createElement("div")
    chart.id = "xp_chart"
    chart.className = "xp_chart"
    document.getElementById("chart_container").appendChild(chart)
    const cChart = document.createElement("canvas")
    cChart.id = "myChart"
    chart.appendChild(cChart)
    const ctx = document.getElementById('myChart').getContext('2d');
  
    // Generate labels from today to an older date
    const labels = [];
    const endDate = new Date(); // End date as today's date
    const startDate = new Date(); // Start date as an older date
    startDate.setDate(endDate.getDate() - dayAmount); // Assuming a span of dayAmount days
  
    for (let i = 0; i < dayAmount; i++) {
      const currentDate = new Date(endDate);
      currentDate.setDate(endDate.getDate() - i);
      const dateString = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      labels.unshift(dateString); // Add the label to the beginning of the array
    }
  
    // get start index value
  
    let index = 0;
    for (const dataElement of ndata.data) {
      const date = new Date(dataElement.createdAt);
      if (date >= startDate) { // If the date is before or equal to startDate, break the loop
        break;
      }
      if (date <= startDate) { // If the date is before or equal to labels[0], add the amount to index
        index += dataElement.amount;
      }
    }
  
    const data = [];
    for (let j = 0; j < dayAmount; j++) {
      ndata.data.forEach((Data) => {
        if (labels[j] === Data.day) {
          index += Data.amount
          data.push(index)
        }
      })
      data.push(index)
    }
  
    const pointRadius1 = data.map((value, index, array) => {
      return index === 0 || value !== array[index - 1] ? 2 : 0;
    });
    const chartData = {
      labels,
      datasets: [{
        label: 'XP Amount',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointRadius: pointRadius1,
        pointHoverRadius: 0,
        showLine: true
      }]
    };
  
    // Create the chart
    const myChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'black',
              font: {
                size: 11,
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: 'black',
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            enabled: true,
            callbacks: {
              label(context) {
              }
            }
          }
        }
      }
    });
  }

  export async function getData(payload, token) {
    try {
        const graphqlResponse = await axios.post(
            'https://01.kood.tech/api/graphql-engine/v1/graphql',
            {
                query: payload
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return await graphqlResponse.data.data
    } catch (error) {
        localStorage.removeItem("jwt")
        console.error('Error:', error.response.data.message);
    }
}

import { main } from "./index.js"
export function skillChart(dataArray) {
  const polarChart = document.createElement("div")
  polarChart.id = "skill_chart"
  polarChart.className = "skill_chart"
  document.getElementById("chart_container").appendChild(polarChart)
  const polarC = document.createElement("canvas")
  polarC.id = "polarC"
  polarChart.appendChild(polarC)

  const ctx = document.getElementById('polarC').getContext('2d');
  const data = {
    labels: dataArray[0],
    datasets: [{
      data: dataArray[1],
      backgroundColor: dataArray[2],
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 0,
    }],
  };
  const options = {
    elements: {
      point: {
        display: true,
        pointStyle: 'circle',
        radius: 2,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scale: {
      pointLabels: {
        display: true,
        font: {
          size: 2,
          weight: 'bold'
        }
      }
    },
    pointLabels: {
      display: true,
      font: {
        size: 14,
        weight: 'bold',
      },
      callback: (value, index) => {
        return value + ' kb';
      },
    },
  }

  const myChart = new Chart(ctx, {
    type: 'pie',
    data,
    options,
  });

}


export function Summary(data) {
    const summary = document.createElement("div");
    summary.id = "summary";
    summary.className = "summary";

    const skillList = document.createElement("ul");
    skillList.className = "skill_list";

    data["skill"].forEach((skill) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <p class="summary_text_title">${skill["name"]}: ${skill["value"]}%</p>
        `;
        skillList.appendChild(listItem);
    });

    summary.innerHTML = `
        <div class="summary_text">
            <p class="summary_title">School Curriculum</p>
            <br>
            <p class="summary_text_title">EXP: ${data["xp"]}</p>
        </div>
    `;
    const skillLists = document.createElement("div");
    skillLists.className = "skill_lists";
    skillLists.appendChild(skillList);
    summary.appendChild(skillLists);

    document.getElementById("main_page").appendChild(summary);
}

export function userInfo(data) {
  const userInfo = document.createElement("div");
  userInfo.id = "user_info";
  userInfo.className = "user_info";
  userInfo.innerHTML = `
    <div class="user_info_img">
    <img src="${data[0]["img"]}" alt="user_img">
    </div>
    <div class="user_info_text">
    <p class="user_info_text_name">${data[0].firstname} ${data[0].surname}</p>
    <p class="user_info_text_email">${data[0].email}</p>
    <p class="user_info_text_dob">Date of Birth: ${data[0]["dateOfBirth"]}</p>
    <p class="user_info_text_audit">Audit Ratio: ${data[0]["auditRatio"]}</p>
    </div>
    `
  main.appendChild(userInfo);

}