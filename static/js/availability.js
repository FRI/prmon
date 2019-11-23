window.addEventListener('load', update)

async function update() {
    let res = await fetch('/classrooms');
    let data = await res.json();
    let availabilityElem = document.querySelector('#availability');
    availabilityElem.innerHTML = '';
    for (let classroom of data) {
        let classroomElem = document.createElement('div');
        classroomElem.classList.add('col-12', 'd-flex');
        let nameElem = document.createElement('h3');
        nameElem.classList.add('w-25')
        nameElem.innerHTML = classroom.name;
        classroomElem.appendChild(nameElem);
        let statusElem = document.createElement('h3');
        statusElem.classList.add('w-75', 'text-center', 'font-weight-bolder');
        statusElem.classList.add(classroom.free ? 'text-success' : 'text-danger')
        statusElem.innerHTML = classroom.free ? 'PROSTO' : (classroom.reason || 'ZASEDENO');
        classroomElem.appendChild(statusElem);
        availabilityElem.appendChild(classroomElem);
    }
    setTimeout(update, 5*60*1000)
}