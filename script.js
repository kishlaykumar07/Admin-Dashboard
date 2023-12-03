let users = [];
let currentPage = 1;
const pageSize = 10;
let totalPages = 1;
let selectedRows = [];
let editingRowIndex = -1;

async function fetchData() {
	try { 
		const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
		const data = await response.json();
		users = data;
		totalPages = Math.ceil(users.length / pageSize);
		renderTable();
	}catch (error) {
		console.error('Error fetching data:', error);
	}
}

function renderTable(filteredUsers = null) {
	const tableBody = document.getElementById('userTableBody');
	tableBody.innerHTML = '';

	const dataToRender = filteredUsers || users;
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;

	for (let i = startIndex; i < endIndex && i < dataToRender.length; i++) {
		const user = dataToRender[i];
		const row = document.createElement('tr');

		if (editingRowIndex === i) {
			row.innerHTML = `
				<td></td>
				<td>${user.id}</td>
				<td><input id="nameInput_${i}" type="text" value="${user.name}"></td>
				<td><input id="emailInput_${i}" type="text" value="${user.email}"></td>
				<td><input id="roleInput_${i}" type="text" value="${user.role}"></td>
				<td>
					<button class="edit" onclick="saveChanges(${i})">Save</button>
					<button class="edit" onclick="cancelEdit()">Cancel</button>
				</td>
			`;
		} else {
			row.innerHTML = `
				<td><input type="checkbox" onclick="selectRow(${i})"></td>
				<td>${user.id}</td>
				<td>${user.name}</td>
				<td>${user.email}</td>
				<td>${user.role}</td>
				<td>
					<button class="edit" onclick="editRow(${i})">Edit</button>
					<button class="delete" onclick="deleteRow(${i})">Delete</button>
				</td>
			`;
		}

		tableBody.appendChild(row);
	}

	updatePaginationButtons();
}

function updatePaginationButtons() {
	document.querySelector('.first-page').disabled = currentPage === 1;
	document.querySelector('.previous-page').disabled = currentPage === 1;
	document.querySelector('.next-page').disabled = currentPage === totalPages;
	document.querySelector('.last-page').disabled = currentPage === totalPages;
	document.getElementById('currentPage').innerText = `Page ${currentPage} of ${totalPages}`;
}

function navigateToPage(page) {
	if (page >= 1 && page <= totalPages) {
		currentPage = page;
		renderTable();
	}
}

function search() {
	const searchTerm = document.getElementById('search').value.toLowerCase();
	const filteredUsers = users.filter(user =>
		Object.values(user).some(value => value.toString().toLowerCase().includes(searchTerm))
	);
	currentPage = 1;
	totalPages = Math.ceil(filteredUsers.length / pageSize);
	renderTable(filteredUsers); 
}

function selectAll() {
	const selectAllCheckbox = document.getElementById('selectAll');
	const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
	checkboxes.forEach(checkbox => {
		checkbox.checked = selectAllCheckbox.checked;
		
		const index = Array.from(checkbox.closest('tr').parentElement.children).indexOf(checkbox.closest('tr'));
		selectRow(index);
	});
}

function selectRow(index) {
	const row = document.querySelectorAll('tbody tr')[index];
	row.classList.toggle('selected');
}


function deleteSelected() {
	const selectedRows = document.querySelectorAll('tbody tr.selected');
	selectedRows.forEach(row => row.remove());
}

function editRow(index) {
	const row = document.querySelectorAll('tbody tr')[index];
	const blocks = row.cells;
	const userData = {
		id: blocks[1].textContent,
		name: blocks[2].textContent,
		email: blocks[3].textConten,
		role: blocks[4].textContent,
	};
	blocks[1].innerHTML = `<input type="text" value="${userData.id}" disabled>`;
	blocks[2].innerHTML = `<input type="text" value="${userData.name}">`;
	blocks[3].innerHTML = `<input type="text" value="${userData.email}">`;
	blocks[4].innerHTML = `<input type="text" value="${userData.role}">`;
	
	const saveButton = document.createElement('button');
	saveButton.classList.add("edit");  
	saveButton.textContent = 'Save';
	saveButton.onclick = () => saveChanges(index);
	const cancelButton = document.createElement('button');
	cancelButton.classList.add("edit");  
	cancelButton.textContent = 'Cancel';
	cancelButton.onclick = () => cancelEdit(index);
	blocks[5].innerHTML = '';
	blocks[5].appendChild(saveButton); 
	blocks[5].appendChild(cancelButton);
}
function editRow(index) {
	editingRowIndex = index;
	renderTable(); 
}

function saveChanges(index) {
	const row = document.querySelectorAll('tbody tr')[index];
	const blocks = row.cells;users[index].name = blocks[2].querySelector('input').value;
        users[index].email = blocks[3].querySelector('input').value;
        users[index].role = blocks[4].querySelector('input').value;
		editingRowIndex = -1;
        renderTable();
	}
	
	function cancelEdit(index) {
		editingRowIndex = -1;
        renderTable();
    }

    function deleteRow(index) {
        const isConfirmed = confirm('Are you want to delete this user?');
        if (isConfirmed) {
   
            users.splice(index + (currentPage - 1) * pageSize, 1);

            totalPages = Math.ceil(users.length / pageSize);
            renderTable();
        }
    }
    fetchData();