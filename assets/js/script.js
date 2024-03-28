$(function () {

    let currentChart;

    // Capturar formulario buscar heroe
    $("#formHero").on("submit", function (event) {
        event.preventDefault();
        const validcacionRegex = /^[0-9]+$/i;

        let idHero = $("#idHero").val();
        // console.log(idHero);

        if (validcacionRegex.test(idHero)) {
            // console.log("regex validado");
            if (idHero < 1 || idHero > 731) {
                alert("Ingrese un id entre 1 y 731");
            } else {
                // console.log("rango validado");
                getHero(idHero);
            };
        } else {
            alert("Ingrese solamente números");
        };

    });

    //Funcion obtener Heroe api
    function getHero(id) {
        let urlHero = `https://www.superheroapi.com/api.php/4905856019427443/${id}`;

        $.ajax({
            method: "GET",
            url: urlHero,
            dataType: "json"
        }).done(function (response) {
            // console.log(response);
            let hero = {
                id: response.id,
                name: response.name,
                image: response.image.url,
                weight: response.appearance.weight[1],
                height: response.appearance.height[1],
                firstApp: response.biography["first-appearance"],
                publisher: response.biography.publisher,
                occupation: response.work.occupation,
                alias: response.biography.aliases,
                connections: response.connections["group-affiliation"],
                stats: response.powerstats
            };

            loadCardHero(hero);
            loadChartHero(hero);

        }).fail(function () {
            alert("Heroe no encontrado, verifique el ID en la guía oficial.");
        });
    };

    function loadCardHero(hero) {
        // console.log(hero);
        $("#cardHero-img").attr("src", hero.image);
        $("#cardHero-id").text(hero.id);
        $("#cardHero-name").text(hero.name);
        $("#cardHero-firstApp").text(hero.firstApp);
        $("#cardHero-publisher").text(hero.publisher);
        $("#cardHero-alias").text(hero.alias);
        $("#cardHero-height").text(hero.height);
        $("#cardHero-weight").text(hero.weight);
        $("#cardHero-occupation").text(hero.occupation);
        $("#cardHero-connections").text(hero.connections);
    };

    function loadChartHero(hero) {
        let heroStatsValues = Object.values(hero.stats).map(stat => {
            if(stat == "null"){
                stat = 0;
            }
            return stat;
       });

        console.log(heroStatsValues);

        const labels = [
            'Intelligence',
            'Strength',
            'Speed',
            'Durability',
            'Power',
            'Combat'
        ];

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Stats',
                    data: heroStatsValues,
                    borderColor: "#c98414",
                    backgroundColor: "rgba(201, 132, 20,0.5)",
                }
            ],
        };

        const statsGraph = $("#statsGraph");

        //Destruye el grafico existente si hubiera uno, para poder actualizar el grafico al buscar un nuevo heroe
        if (currentChart) {
            currentChart.destroy();
        }

        currentChart = new Chart(statsGraph, {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Power Stats'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            },
        });
    };

});









