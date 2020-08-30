document.addEventListener("DOMContentLoaded", function () {

	// init Materialbox
	$(document).ready(function () {
		$(".materialboxed").materialbox();
	});	

	// Sidebar Nav
	var elems = document.querySelectorAll(".sidenav");
	M.Sidenav.init(elems);
	loadNav();

	function convertToSlug(Text) {
		return Text.toLowerCase()
			.replace(/ /g, "-")
			.replace(/[^\w-]+/g, "");
	}

	function wordLimit(str, no_words) {
		return str.split(" ").splice(0,no_words).join(" ");
	}

	function loadContent() {
		fetch("http://my-json-server.typicode.com/albretost/pwa-api/posts")
			.then((response) => response.json())
			.then((data) => {
				let output = "";
				data.map((items) => {
					output += `
					<div class="col s12 m6">
                    <div class="card large">
                      <div class="card-image">
                        <img src="images/blog1.jpg">
                        <span class="card-title">${items.title}</span>
                      </div>
                      <div class="card-content">
                        <p>${wordLimit(items.body, 30)}</p>
                      </div>
                      <div class="card-action">
                        <a href="${convertToSlug(items.title)}">Read More</a>
                      </div>
                    </div>
				  </div> `;
					document.querySelector("#blog-content").innerHTML = output;
				});
			});
	}

	function loadNav() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4) {
				if (this.status != 200) return;

				// Menampilkan link navbar dari nav.html
				document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
					elm.innerHTML = xhttp.responseText;
				});

				// Menambah event click link nav
				document
					.querySelectorAll(".sidenav a, .topnav a")
					.forEach(function (elm) {
						elm.addEventListener("click", function (event) {
							// Menutup sidenav
							var sidenav = document.querySelector(".sidenav");
							M.Sidenav.getInstance(sidenav).close();

							// Memuat konten dari event click navbar
							page = event.target.getAttribute("href").substr(1);
							if (page == "home" || page == "contact")
								setTimeout(function () {
									$(".parallax").parallax();
								}, 100);
							loadPage(page);
						});
					});
			}
		};
		xhttp.open("GET", "nav.html", true);
		xhttp.send();
	}

	// Memuat konten halaman
	var page = window.location.hash.substr(1);
	if (page == "") page = "home";
	if (page == "home" || page == "contact")
		setTimeout(function () {
			$(".parallax").parallax();
		}, 200);
	loadPage(page);

	function loadPage(page) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4) {
				var content = document.querySelector("#body-content");
				if (this.status == 200) {
					content.innerHTML = xhttp.responseText;
				} else if (this.status == 404) {
					content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
				} else {
					content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
				}
			}
		};
		xhttp.open("GET", "pages/" + page + ".html", true);
		xhttp.send();
		if (page == "blog") {
			loadContent();
		}
	}
});
