import {
    studentInfoData
    , studentXpChart,
    studentBasicSkill,
    userInfoData
} from "./query.js";
import { convertCreatedAtToNewFormat, convertDataToSkillData, findInfo, Summary, userInfo, expChart, skillChart, getData, chartData } from "./queryFuncs.js"
import { Logout } from "./logout.js"
import { main } from "./index.js";
const timeLength = {
    "1 week": 7,
    "1 month": 30,
    "3 months": 90,
    "6 months": 180,
    "1 year": 365
}
export default class Student {
    constructor() {
        this.token = localStorage.getItem("jwt")
        document.title = "Student"
        this.id = null
        this.name = null
        this.transactionData = null
        this.fetchData()
            .then(() => {
                this.main()
            }
            )
    }
    main() {
        userInfo(this.userInfo)
        const chartContainer = document.createElement("div")
        chartContainer.id = "chart_container"
        chartContainer.className = "chart_container"
        main.appendChild(chartContainer)

        expChart(chartData(this.transactionData), timeLength["6 months"])
        skillChart(convertDataToSkillData(this.basicskill))
        this.SummaryData = findSummary(this.transactionData, this.basicskill)
        Summary(this.SummaryData)
        Logout()
    }

    async fetchData() {
        const student = await getData(studentInfoData, this.token)
        if (student == undefined) {
            alert("You are not a student")
            localStorage.removeItem("jwt")
            window.location.href = "/"
        }
        this.id = student["user"][0]["id"]
        this.name = student["user"][0]["login"]
        const data = await getData(studentXpChart(this.id), this.token)
        data.transaction.sort(function (a, b) {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateA - dateB;
        });
        data["transaction"] = convertCreatedAtToNewFormat(data["transaction"])
        this.transactionData = data
        this.basicskill = await getData(studentBasicSkill(this.id), this.token)
        this.userInfo = findInfo(await getData(userInfoData(this.id), this.token))
    }
}

function findSummary(data, basicskill) {
    const obj = []
    // find xp
    data.transaction.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA - dateB;
    }
    );
    let xp = 0
    data.transaction.forEach((transaction) => {
        xp += transaction.amount
    }
    )
    obj.xp = xp
    // find skill
    const skills = convertDataToSkillData(basicskill)
    const names = skills[0]
    const values = skills[1]
    const ndata = names.map((name, index) => ({ name, value: values[index] }));
    obj.skill = ndata
    obj.skill.sort((a, b) => b.value - a.value);
    return obj
}