let express = require('express'),
    app = express(),
    axios = require('axios');

app.set('view engine', 'pug');

if (process.env.NODE_ENV !== 'production') {
    app.use(require('morgan')('dev'));
}

async function getToday() {
    let response = await axios.get('https://rezervacije.fri.uni-lj.si/sets/rezervacije_fri/types/classroom/time_view');
    return response.data.res_list
}

async function getOccupiedStatus(res_list) {
    let response = [];
    for (let classroom of res_list) {
        let reservations = classroom.reservations;
        for (let period of reservations) {
            if (nowBetween(period.start, period.end)) {
                let current = await getCurrent(period);
                response.push({
                    name: classroom.reservable.slug,
                    free: current.free,
                    reason: current.reason
                })
            }
        }
    }
    return response
}

async function getReservation(resId) {
    let response = await axios.get('https://rezervacije.fri.uni-lj.si/reservations/'+resId+'/');
    return response.data;
}

async function getCurrent(period) {
    if (period.reservations.length == 0) return {
        free: true,
        reason: null
    };
    for (let resId of period.reservations) {
        let reservation = await getReservation(resId);
        if (nowBetween(reservation.start, reservation.end)) return {
            free: false,
            reason: reservation.reason
        };
    }
    return {
        free: true,
        reason: null
    };
}

function nowBetween(startS, endS) {
    let start = new Date(startS);
    let end = new Date(endS);
    let now = new Date();
    if (now > start && now < end) return true;
    return false;
}

app.get('/classrooms', async (req, res) => {
    let res_list = await getToday();
    let response = await getOccupiedStatus(res_list);
    res.send(response);
})

app.get('/classrooms/:resource', async (req, res) => {
    let res_list = (await getToday())
        .filter((element) => {
            if (element.reservable.resources.indexOf(parseInt(req.params.resource))>=0) return true;
            return false;
        })
    let response = await getOccupiedStatus(res_list);
    res.send(response);
})

app.get('/', (req, res) => {
    res.render('status');
})

app.use(express.static('./static'));
app.use(express.static('./node_modules/bootstrap/dist'));

let port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening on', port));