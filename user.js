const BASE_URL = 'http://localhost:8000'

window.onload = async () => {
    await loadData()
}

const loadData = async () => {
    console.log('on load');

    const response = await axios.get(`${BASE_URL}/users`)

    console.log(response.data);

    const userDOM = document.getElementById('user')

    let htmlData = '<div>'

    for (let i = response.data.length - 1; i >= 0 ; i--) {
        let user = response.data[i]
        htmlData += `<div class="card card-body mb-2">
        ${user.firstname} ${user.lastname} 
        <a href='index.html?id=${user.id}' class="text-decoration-none">

        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button class="btn btn-outline-success">
        Edit
        </button>
        </a>
        
        <button class="delete btn btn-outline-danger" 
        data-id='${user.id}'>
        Delete
        </button>
        </div>
        </div>`
    }

    htmlData += '</div>'

    userDOM.innerHTML = htmlData

    const deleteDOMs = document.getElementsByClassName('delete')

    for (let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/users/${id}`)
                loadData()
            } catch (error) {
                console.log('error', error);
            }
        })
    }
}