

// =====================================
// 1. PENGATURAN LOGIN
// =====================================

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const loginContainer = document.getElementById("loginContainer");
const appContainer = document.getElementById("appContainer");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");

function showLogin() {
    loginContainer.hidden = false;
    appContainer.hidden = true;
}

function showDashboard() {
    loginContainer.hidden = true;
    appContainer.hidden = false;
    renderEmployees();
    updateStatistics();
}

// Proses login
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem("isLoggedIn", "true");
        loginMessage.textContent = "";
        loginForm.reset();
        showDashboard();
    } else {
        loginMessage.textContent = "Username atau password salah!";
        document.getElementById("loginPassword").value = "";
    }
});

// Proses logout
logoutButton.addEventListener("click", function() {
    const yakin = confirm("Apakah kamu yakin ingin logout?");

    if (yakin) {
        sessionStorage.removeItem("isLoggedIn");
        showLogin();
    }
});

// Periksa status login
if (sessionStorage.getItem("isLoggedIn") === "true") {
    showDashboard();
} else {
    showLogin();
}


// =====================================
// 2. DATA KARYAWAN
// =====================================

const employeeForm = document.getElementById("employeeForm");
const employeeTable = document.getElementById("employeeTable");
const searchInput = document.getElementById("searchInput");
const submitButton = document.getElementById("submitButton");
const resetButton = document.getElementById("resetButton");

let employees = [];

try {
    employees = JSON.parse(localStorage.getItem("employees")) || [];
    if (!Array.isArray(employees)) employees = [];
} catch (error) {
    employees = [];
}

// Simpan data ke browser
function saveEmployees() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

// Mengamankan teks yang ditampilkan di tabel
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[character];
    });
}

// Tampilkan data karyawan
function renderEmployees() {
    const keyword = searchInput.value.toLowerCase();

    const filteredEmployees = employees.filter(function(employee) {
        return employee.nama.toLowerCase().includes(keyword) ||
               employee.nik.toLowerCase().includes(keyword);
    });

    if (filteredEmployees.length === 0) {
        employeeTable.innerHTML =
            '<tr><td colspan="9">Data karyawan tidak ditemukan.</td></tr>';
        return;
    }

    employeeTable.innerHTML = filteredEmployees.map(function(employee, index) {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHTML(employee.nama)}</td>
                <td>${escapeHTML(employee.nik)}</td>
                <td>${escapeHTML(employee.jabatan)}</td>
                <td>${escapeHTML(employee.departemen)}</td>
                <td>${escapeHTML(employee.telepon)}</td>
                <td>${escapeHTML(employee.status)}</td>
                <td>${escapeHTML(employee.alamat)}</td>
                <td>
                    <button class="edit-button"
                        data-action="edit" data-id="${employee.id}">
                        Edit
                    </button>
                    <button class="delete-button"
                        data-action="delete" data-id="${employee.id}">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

// Tambah dan edit data
employeeForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("employeeId").value;

    const employeeData = {
        nama: document.getElementById("nama").value.trim(),
        nik: document.getElementById("nik").value.trim(),
        jabatan: document.getElementById("jabatan").value.trim(),
        departemen: document.getElementById("departemen").value.trim(),
        telepon: document.getElementById("telepon").value.trim(),
        status: document.getElementById("status").value,
        alamat: document.getElementById("alamat").value.trim()
    };

    if (id) {
        const index = employees.findIndex(function(employee) {
            return String(employee.id) === id;
        });

        if (index !== -1) {
            employees[index] = {
                ...employeeData,
                id: employees[index].id
            };
        }
    } else {
        employeeData.id = Date.now();
        employees.push(employeeData);
    }

    saveEmployees();
    employeeForm.reset();
    document.getElementById("employeeId").value = "";
    submitButton.textContent = "Simpan Karyawan";

    renderEmployees();
    updateStatistics();

    alert("Data karyawan berhasil disimpan!");
});

// Tombol edit dan hapus
employeeTable.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "edit") {
        editEmployee(id);
    }

    if (action === "delete") {
        deleteEmployee(id);
    }
});

// Fungsi edit
function editEmployee(id) {
    const employee = employees.find(function(item) {
        return String(item.id) === id;
    });

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
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Fungsi hapus
function deleteEmployee(id) {
    const yakin = confirm("Yakin ingin menghapus karyawan ini?");

    if (!yakin) return;

    employees = employees.filter(function(employee) {
        return String(employee.id) !== id;
    });

    saveEmployees();
    renderEmployees();
    updateStatistics();
}

// Pencarian
searchInput.addEventListener("input", renderEmployees);

// Bersihkan form
resetButton.addEventListener("click", function() {
    document.getElementById("employeeId").value = "";
    submitButton.textContent = "Simpan Karyawan";
});

// Statistik
function updateStatistics() {
    document.getElementById("totalKaryawan").textContent = employees.length;

    const departments = new Set(
        employees.map(function(employee) {
            return employee.departemen.toLowerCase();
        })
    );

    document.getElementById("totalDepartemen").textContent =
        departments.size;

    const activeEmployees = employees.filter(function(employee) {
        return employee.status === "Aktif";
    });

    document.getElementById("totalAktif").textContent =
        activeEmployees.length;
}

// Tampilkan data saat aplikasi dibuka
renderEmployees();
updateStatistics();
