// const Database = require('./database/db')

// const { subjects, weekdays, getSubject, convertHoursToMinutes } = require('./utils/format')

// function pageLanding(req, res) {
//     return res.render("index.html")
// }

// async function pageStudy(req, res) {
//     const filters = req.body

//     if(!filters.subject || !filters.weekday || !filters.time){
//         return res.render("study.html", { filters, subjects, weekdays })
//     }

//     // Converter horas em minutos

//     const timeToMinutes = convertHoursToMinutes(filters.time)

//     const query = `
//         SELECT classes.*, proffys.*
//         FROM proffys
//         JOIN classes ON (classes.proffy_id = proffys.id)
//         WHERE EXISTS(
//             SELECT class_schedule.*
//             FROM class_schedule
//             WHERE class_schedule.class_id = classes.id
//             AND class_schedule.weekday = ${filters.weekday}
//             AND class_schedule.time_from <= ${timeToMinutes}
//             AND class_schedule.time_to > ${timeToMinutes}
//         )
//         AND classes.subject = '${filters.subject}'
//     `

//     try{
//         const db = await Database
//         const proffys = await db.all(query)

//         proffys.map((proffy)=> {
//             proffy.subject = getSubject(proffy.subject)
//         })

//         return res.render('study.html', { proffys, filters, subjects, weekdays })
//     } catch(e) {
//         console.log(e)
//     }
// }

// function pageGiveClasses(req, res) {
//     return res.render("give-classes.html", {subjects, weekdays})
// }

// async function saveClasses(req, res) {
//     const createProffy = require('./database/createProffy')
    
//     const proffyValue = {
//         name: req.body.name,
//         avatar: req.body.avatar,
//         whatsapp: req.body.whatsapp,
//         bio: req.body.bio
//     }

//     const classValue = {
//         subject: req.body.subject,
//         cost: req.body.cost,
//     }
    
//     const classScheduleValues = req.body.weekday.map((weekday, index) => {
//         return {
//             weekday,
//             time_from: convertHoursToMinutes(req.body.time_from[index]),
//             time_to: convertHoursToMinutes(req.body.time_to[index])
//         }
//     })

//     try{
//         const db = await Database
//         await createProffy(db, { proffyValue, classValue, classScheduleValues })

//         let queryString = "?subject=" + req.body.subject
//         queryString += "&weekday=" + req.body.weekday[0]
//         queryString += "&time=" + req.body.time_from[0]

//         return res.redirect("/study" + queryString)
//     }catch(e){
//         console.log(e)
//     }
    
// }
// module.exports = {
//     pageLanding,
//     pageStudy,
//     pageGiveClasses,
//     saveClasses
// }

//Importando os objetos de bancos de dados, que est??o em db.js
const Database = require('./database/db')

//Importando os objetos que est??o no format.js (subjects, weekdays e getSubjects)
const { subjects, weekdays, getSubject , convertHoursToMinutes } = require('./utils/format')

function pageLanding(req, res) {
    return res.render('index.html')
}

async function pageStudy(req, res) {
    const filters = req.query //Capturando dos dados da URL (na verdade s??o os par??metros da URL), vindo do navegador, para o back-end

    //Se n??o tiver nenhum fitro de mat??ria, dia e hor??rio preenchido no formul??rio, renderizar a mesma p??gina study.html
    if (!filters.subject || !filters.weekday || !filters.time) {
        return res.render('study.html', { filters, subjects, weekdays })
    }

    //Convers??o de horas em minutos (o banco ir?? armazenar os valores time_from e time_to em minutos)
    const timeToMinutes = convertHoursToMinutes(filters.time)

    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS(
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        ) 
        AND classes.subject = '${filters.subject}'       
        `

    //Caso haja erro na hora da consulta do banco de dados
    try {
        const db = await Database
        const proffys = await db.all(query)

        proffys.map((proffy) => {
            proffy.subject = getSubject(proffy.subject)
        })
        
        /*Se toda a execu????o do banco de dados concluir com ??xito, renderizar a p??gina study com todos os dados de proffys 
        preenchidos*/
        return res.render('study.html', { proffys, subjects, filters, weekdays })

    } catch (error) {
        console.log(error)
    }
}

function pageGiveClasses(req, res) {
    return res.render('give-classes.html', { subjects, weekdays }) //Se n??o houve preenchimento dos dados do formul??rio, apenas mostrar a mesma p??gina
}

async function saveClasses(req, res) {
    const createProffy = require('./database/createProffy')

    const proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    }

    const classValue = {
        subject: req.body.subject,
        cost: req.body.cost
    }

    const classScheduleValues = req.body.weekday.map(
        (weekday, index) => {
            return {
                weekday,
                time_from: convertHoursToMinutes(req.body.time_from[index]),
                time_to: convertHoursToMinutes(req.body.time_to[index])
            }
        })


    try {
        const db = await Database

        await createProffy(db, { proffyValue, classValue, classScheduleValues })        

        let queryString = '?subject=' + req.body.subject
        queryString += '&weekday=' + req.body.weekday[0]
        queryString += '&time=' + req.body.time_from[0]

        return res.redirect('/study' + queryString)
    } catch (error) {
        console.log(error)
    }

    // const data = req.query //Capturando dos dados da URL (na verdade s??o os par??metros da URL), vindo do navegador, para o back-end

    // //Adicionando dados do formul??rio ?? lista de proffys
    // const isEmpty = Object.keys(data).length == 0
    // if (!isEmpty) {
    //     data.subject = getSubject(data.subject)
    //     proffys.push(data)        
    //     return res.redirect('/study') //Redirecionando para a p??gina study.html com os dados adicionados do formul??rio
    // }
}

module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses
}