
// Mengambil elemen HTML
const employeeForm = document.getElementById("employeeForm");
const employeeTable = document.getElementById("employeeTable");
const searchInput = document.getElementById("searchInput");
const submitButton = document.getElementById("submitButton");

// Mengambil data dari penyimpanan browser
let employees = JSON.parse(localStorage.getItem("employees")) || [];

// Menampilkan data karyawan
function renderEmployees(data = employees) {
    employeeTable.innerHTML = "";

    if (data.length === 0) {
        employeeTable.innerHTML = `
            <tr>
                <td colspan="8">Belum ada data karyawan</td>
            </tr>
        `;
    } else {
        data.forEach((employee, index) => {
            const row = document.createElement("tr");

            const values = [
                index + 1,
                employee.nama,
                employee.nik,
                employee.jabatan,
                employee.departemen,
                employee.telepon,
                employee.status
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.type = "button";
            editButton.style.marginRight = "5px";
            editButton.onclick = () => editEmployee(employee.id);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Hapus";
            deleteButton.type = "button";
            deleteButton.style.background = "#dc2626";
            deleteButton.onclick = () => deleteEmployee(employee.id);

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            employeeTable.appendChild(row);
        });
    }

    updateStatistics();
}

// Menyimpan data ke browser
function saveEmployees() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

// Menghitung statistik
function updateStatistics() {
    document.getElementById("totalKaryawan").textContent =
        employees.length;

    const departments = new Set(
        employees.map(employee =>
            employee.departemen.trim().toLowerCase()
        )
    );

    document.getElementById("totalDepartemen").textContent =
        departments.size;

    const activeEmployees = employees.filter(
        employee => employee.status === "Aktif"
    );

    document.getElementById("totalAktif").textContent =
        activeEmployees.length;
}

// Menambahkan dan mengedit karyawan
employeeForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("employeeId").value;

    const employee = {
        id: id || Date.now().toString(),
        nama: document.getElementById("nama").value.trim(),
        nik: document.getElementById("nik").value.trim(),
        jabatan: document.getElementById("jabatan").value.trim(),
        departemen: document.getElementById("departemen").value.trim(),
        telepon: document.getElementById("telepon").value.trim(),
        status: document.getElementById("status").value,
        alamat: document.getElementById("alamat").value.trim()
    };

    // Memeriksa NIK yang sama
    const duplicateNIK = employees.some(item =>
        item.nik === employee.nik && item.id !== id
    );

    if (duplicateNIK) {
        alert("NIK sudah digunakan oleh karyawan lain!");
        return;
    }

    if (id) {
        employees = employees.map(item =>
            item.id === id ? employee : item
        );

        alert("Data karyawan berhasil diperbarui!");
    } else {
        employees.push(employee);
        alert("Data karyawan berhasil ditambahkan!");
    }

    saveEmployees();
    renderEmployees();
    employeeForm.reset();

    document.getElementById("employeeId").value = "";
    submitButton.textContent = "Simpan Karyawan";
});

// Mengedit karyawan
function editEmployee(id) {
    const employee = employees.find(item => item.id === id);

    if (!employee) return;

    document.getElementById("employeeId").value = employee.id;
    document.getElementById("nama").value = employee.nama;
    document.getElementById("nik").value = employee.nik;
    document.getElementById("jabatan").value = employee.jabatan;
    document.getElementById("departemen").value = employee.departemen;
    document.getElementById("telepon").value = employee.telepon;
    document.getElementById("status").value = employee.status;
    document.getElementById("alamat").value = employee.alamat;

    submitButton.textContent = "Update Karyawan";

    document.getElementById("form-karyawan").scrollIntoView({
        behavior: "smooth"
    });
}

// Menghapus karyawan
function deleteEmployee(id) {
    const confirmation = confirm(
        "Apakah kamu yakin ingin menghapus data karyawan ini?"
    );

    if (confirmation) {
        employees = employees.filter(item => item.id !== id);

        saveEmployees();
        renderEmployees();

        alert("Data karyawan berhasil dihapus!");
    }
}

// Fitur pencarian
searchInput.addEventListener("input", function() {
    const keyword = searchInput.value.toLowerCase();

    const filteredEmployees = employees.filter(employee =>
        employee.nama.toLowerCase().includes(keyword) ||
        employee.nik.toLowerCase().includes(keyword)
    );

    renderEmployees(filteredEmployees);
});

// Menampilkan data saat aplikasi dibuka
renderEmployees();

// ===================================
// SISTEM LOGIN DAN LOGOUT
// ===================================

// Username dan password administrator
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// Mengambil elemen HTML
const loginContainer = document.getElementById("loginContainer");
const appContainer = document.getElementById("appContainer");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");
const loggedInUser = document.getElementById("loggedInUser");

// Memeriksa status login saat halaman dibuka
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        showDashboard();
    } else {
        showLogin();
    }
}

// Menampilkan halaman login
function showLogin() {
    loginContainer.style.display = "flex";
    appContainer.style.display = "none";
}

// Menampilkan dashboard
function showDashboard() {
    loginContainer.style.display = "none";
    appContainer.style.display = "block";

    loggedInUser.textContent = "Administrator";
}

// Proses login
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {
        sessionStorage.setItem("isLoggedIn", "true");

        loginMessage.textContent = "";

        loginForm.reset();

        showDashboard();

        alert("Login berhasil! Selamat datang.");
    } else {
        loginMessage.textContent =
            "Username atau password salah!";

        document.getElementById("loginPassword").value = "";
    }
});

// Proses logout
logoutButton.addEventListener("click", function() {
    const confirmation = confirm(
        "Apakah kamu yakin ingin logout?"
    );

    if (confirmation) {
        sessionStorage.removeItem("isLoggedIn");

        showLogin();

        loginForm.reset();

        loginMessage.textContent = "";

        alert("Kamu berhasil logout.");
    }
});

// Jalankan pemeriksaan login
checkLogin();
