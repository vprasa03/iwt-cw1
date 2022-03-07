// Create closure for global state.
function createState() {
	let state = {};
	const setState = (newState) => {
		state = newState;
	};
	const getState = () => state;

	return { setState, getState };
}

// Execute when document has loaded.
$(document).ready(function () {
	const app = $("#app");
	const searchForm = $("#search-form");

	searchForm[0].reset(); // Reset form
	app.removeClass("hidden");

	const tableData = createState();

	const updateTable = () => {
		const data = tableData.getState();
		const stats = $("#stats");
		stats.addClass("hidden");

		// Update name and year from data
		stats.find("#data-title").text(`${data.name} (${data.year})`);

		// Update match data
		const tBody = stats.find("tbody");

		tBody.empty();
		tBody.append(
			data.match.reduce((acc, match, i) => {
				let output = "";
				match.player.forEach((player, j) => {
					output += `<tr>
					<td>${j === 0 ? i + 1 : ""}</td>
					<td>${match.round}</td>
					<td>${
						player.outcome === "won"
							? "<b>" + player.name + "</b>"
							: player.name
					}</td>
					${player.set.map((set) => "<td>" + set + "</td>")}
				</tr>`;
				});

				return acc + output;
			}, "")
		);

		$("#stats").removeClass("hidden");
	};

	// Find advanced filters - Round, Player and Set
	const filters = searchForm.find("#advanced-filters input:disabled");

	// Set filter labels
	function setFilterLabels(name, value) {
		searchForm
			.find(`#advanced-filters label[for="${name}"]`)
			.text(name.charAt(0).toUpperCase() + name.slice(1) + ": " + value);
	}

	// Reset filters
	function resetFilters() {
		// Reset Round, Player & Set inputs
		for (let el of filters) {
			el.disabled = true;
			if (el.name.includes("comparator")) {
				if (el.value === "=") el.checked = true;
			} else {
				el.value = $(el).attr("default-value");
				setFilterLabels(el.name, el.value);
			}
		}
	}

	// Toggle advanced filters
	searchForm.find('input[name="filters"]').click((e) => {
		if (!e.target.checked) {
			resetFilters();
		} else {
			for (let el of filters) {
				el.disabled = false;
			}
		}
	});

	// Change listener for advanced filters
	for (let el of filters) {
		$(el).change((e) => {
			setFilterLabels(e.target.name, e.target.value);
		});
	}

	function comparatorCondition(comparator, matchVal, paramVal) {
		switch (comparator) {
			case "=":
				return matchVal === paramVal;
			case "<":
				return matchVal < paramVal;
			case ">":
				return matchVal > paramVal;
			default:
				return false;
		}
	}

	function filterValidation(match, params) {
		if (
			!comparatorCondition(
				params["round-comparator"],
				parseInt(match.round),
				parseInt(params.round)
			)
		)
			return false;
		if (
			!comparatorCondition(
				params["set-comparator"],
				match.player[0].set.length,
				parseInt(params.set)
			)
		)
			return false;
		return true;
	}

	// Form submit listener
	searchForm.submit((e) => {
		e.preventDefault();

		const filtersEnabled = $(this).find('input[name="filters"]')[0].checked;

		$.get(
			$(this).find('select[name="category"] option:selected').val(),
			{},
			(data) => {
				if (filtersEnabled) {
					const filterParams = {};
					for (let el of filters) {
						if (el.name.includes("comparator") && !el.checked) {
						} else {
							filterParams[el.name] = el.value;
						}
					}

					data.match = data.match.filter((matchItem) =>
						filterValidation(matchItem, filterParams)
					);
				}

				tableData.setState(data);
				updateTable();
			}
		);
	});
});
