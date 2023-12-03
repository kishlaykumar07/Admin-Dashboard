let users = [];
    let currentPage = 1;
    const pageSize = 10;
    let totalPages = 1;
    let selectedRows = [];

    async function fetchData() {
        try {
            const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
            const data = await response.json();
            users = data;
            totalPages = Math.ceil(users.length / pageSize);
            renderTable();
        } catch (error) {
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
        const cells = row.cells;
        const userData = {
            id: cells[1].textContent,
            name: cells[2].textContent,
            email: cells[3].textContent,
            role: cells[4].textContent,
        };
      
        cells[1].innerHTML = `<input type="text" value="${userData.id}" disabled>`;
        cells[2].innerHTML = `<input type="text" value="${userData.name}">`;
        cells[3].innerHTML = `<input type="text" value="${userData.email}">`;
        cells[4].innerHTML = `<input type="text" value="${userData.role}">`;

        const saveButton = document.createElement('button');
        saveButton.classList.add("edit");  
        saveButton.textContent = 'Save';
        saveButton.onclick = () => saveChanges(index);
        const cancelButton = document.createElement('button');
        cancelButton.classList.add("edit");  
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => cancelEdit(index);

 
        cells[5].innerHTML = '';
        cells[5].appendChild(saveButton);
        cells[5].appendChild(cancelButton);
    }
    
    function saveChanges(index) {
        const row = document.querySelectorAll('tbody tr')[index];
        const cells = row.cells;
        users[index].name = cells[2].querySelector('input').value;
        users[index].email = cells[3].querySelector('input').value;
        users[index].role = cells[4].querySelector('input').value;
        renderTable();
    }

    function cancelEdit(index) {
   
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