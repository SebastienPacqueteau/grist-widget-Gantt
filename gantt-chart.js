/*
*
*** Code pour interagir avec Grist
*
*/

// ====================================
// ==== Configuration pour Grist ======
// ====================================

let colonnesNecessaires = [
	{
    name: 'Projet',
    title: "Nom du projet",
    type: 'Any', // optional type of the column, // Int (Integer column), Numeric (Numeric column), Text, Date, DateTime, Bool (Toggle column), Choice, ChoiceList, Ref (Reference column), RefList (Reference List), Attachments.
		optional: false // if column is optional.
	},
	{name: 'NbAgents',title: "Nombre d'Agents sur le projet",type: 'Int',optional: false},
  {name: 'Agents',title: "liste des agents",type: 'Any',optional: false},
  {name: 'Service',title: "Service",type: 'Any', optional: false},
  {name: 'SousDirection',title: "sous-direction",type: 'Any', optional: false},
	{name: 'AutoriteHierarchique',title: "Responsable du ou des agent(s)",type: 'Any',optional: false},
  {name: 'Description',title: "Description du projet",type: 'Text',optional: true},
  {name: 'DateDebut',title: "Date de début de la mission",type: 'Date',optional: false},
  {name: 'DateFin',title: "Date de fin de la mission",type: 'Date',optional: false},
  {name: 'Quotite',title: "Quotité du temps de l'agent (en %)",type: 'Int',optional: false},
  {name: 'Priorite',title: "Priorite du projet pour le service et la direction",type: 'Int',optional: true}
];

class Projet{
	constructor(nomProjet,dateDebut,dateFin,agent,service,sousDirection, quotite,priorite){
		//this.infoSiret = infoSiret.results[0];
		this.x = [dateDebut,dateFin];
		this.y = nomProjet;
		this.Agents = agent;
		this.Service = service;
		this.SousDirection = sousDirection;
		this.Quotite = quotite;
		this.Priorite = priorite;
	}
}

// ====================================
// ==== Configuration du diagramme ====
// ====================================

//Par défaut on met la date du jour - 2 mois
let dateDebutGantt = new Date();
dateDebutGantt.setMonth(dateDebutGantt.getMonth() - 2);
//Par défaut on met la date du jour + 6 mois
let dateFinGantt = new Date();
dateFinGantt.setMonth(dateFinGantt.getMonth() + 6);


//liste des projets à connecter à un tableau Grist
let listeProjets = [];

//Données pour le graphique
const data = {
  datasets: [{
    labels: 'liste des projets',
    data: listeProjets,
    backgroundColor: [
      'rgba(255,26,104,0.2)',
      'rgba(54,162,235,0.2)',
      'rgba(255,206,86,0.2)',
      'rgba(75,192,192,0.2)',
      'rgba(153,102,255,0.2)',
      'rgba(255,159,64,0.2)',
      'rgba(0,0,0,0.2)'
    ],
    borderColor: [
      'rgba(255,26,104,1)',
      'rgba(54,162,235,1)',
      'rgba(255,206,86,1)',
      'rgba(75,192,192,1)',
      'rgba(153,102,255,1)',
      'rgba(255,159,64,1)',
      'rgba(0,0,0,1)'
    ],
    borderWidth: 1,
    borderSkipped: false,
    borderRadius: 10, //avoir des arrondis
    barPercentage: 0.5 //hauteur des bars
  }]
};
//console.log(listeProjets);
//console.log(data);


//Objet pour définir la ligne du jour
const LigneJour = {
  id: 'LigneJour',
  //afterDatasetsDraw : utiliser cette fonction pour mettre au premier plan la ligne du jour
  //beforeDatasetsDraw : utiliser cette fonction pour mettre au second plan
  beforeDatasetsDraw(chart, args, pluginOptions){
    const {ctx, data, chartArea: {top, bottom,left, rogjt} , scales: {x,y} } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 3;//largeur de la ligne
    ctx.strokeStyle = 'rgba(255,26,104,1)'; //la couleur de la ligne
    ctx.setLineDash([6,6])
    ctx.moveTo(x.getPixelForValue(new Date()),top);
    ctx.lineTo(x.getPixelForValue(new Date()),bottom);
    ctx.stroke();
  }
}

const Agents ={
  id: 'Agents',
  beforeDatasetsDraw(chart, args, pluginOptions){
    const {ctx, data, chartArea: {top, bottom,left, rogjt} , scales: {x,y} } = chart;
    ctx.save();
    ctx.font = 'bolder 12px sans-serif';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';
    data.datasets[0].data.forEach((projet, i) => {
      ctx.fillText(projet.Agents, 10,y.getPixelForValue(i));
    });
    ctx.fillText('Agents', 10,top-20);
    ctx.restore();
  }
}

const config = {
  type: 'bar',
  data,
  options: {
    layout:{
      padding: {
        left: 100
      }
    },
    indexAxis: 'y',
    scales: {
      x: {
        position: 'top', // position de l'axe
        type: 'time',
        time: {
          unit: "month"
        },
        min: dateDebutGantt.toLocaleString("en-CA",{dateStyle: "short"}),//date minimal affichée
        max: dateFinGantt.toLocaleString("en-CA",{dateStyle: "short"})//date maximal affichée
      }
    },
    plugins: {
      legend: {
        display: false //suppression de la légende / série sur le graphique
      }
    }
  },
  plugins: [LigneJour, Agents]
};
//console.log(config);

function moisPrecedent(){
  dateDebutGantt.setMonth(dateDebutGantt.getMonth() -1);
  dateFinGantt.setMonth(dateFinGantt.getMonth() -1);

	myChart.config.options.scales.x.min = formatageDate(dateDebutGantt); //dateDebutGantt.toLocaleString("en-CA",{dateStyle: "short"});
  myChart.config.options.scales.x.max = formatageDate(dateFinGantt); //dateFinGantt.toLocaleString("en-CA",{dateStyle: "short"});
  myChart.update();

}
function moisSuivant(){
  dateDebutGantt.setMonth(dateDebutGantt.getMonth() +1);
  dateFinGantt.setMonth(dateFinGantt.getMonth() +1);

	myChart.config.options.scales.x.min = formatageDate(dateDebutGantt); //dateDebutGantt.toLocaleString("en-CA",{dateStyle: "short"});
  myChart.config.options.scales.x.max = formatageDate(dateFinGantt); //dateFinGantt.toLocaleString("en-CA",{dateStyle: "short"});
  myChart.update();

}

function moisMilieu(date){
	ajouteMoisDate (date, dateDebutGantt, -4)
	ajouteMoisDate (date, dateFinGantt, 4)
	//console.log(dateDebutGantt,dateFinGantt,date.value);

	myChart.config.options.scales.x.min = formatageDate(dateDebutGantt); //dateDebutGantt.toLocaleString("en-CA",{dateStyle: "short"});
  myChart.config.options.scales.x.max = formatageDate(dateFinGantt); //dateFinGantt.toLocaleString("en-CA",{dateStyle: "short"});
  myChart.update();
}

function formatageDate(date){
	// retour la date sous le format "2025-09-03" en ayant en entrée un objet Date()
	return date.toLocaleString("en-CA",{dateStyle: "short"});
}

function ajouteMoisDate (date, objDate, nbMois){
	//date ici est une variale en prevenance d'un champ input de type date
	objDate.setYear(parseInt(date.value.split('-')[0]));
	objDate.setMonth(parseInt(date.value.split('-')[1])-1+nbMois); //car le mois de janvier est le mois 0
	objDate.setDate(parseInt(date.value.split('-')[2]));
}

/* TODO: barre de défilement pour les longues listes de projets */

/*const canvasBoxBarreDefilement = document.querySelector('.canvasBoxBarreDefilement');
if (listeProjets.length>10){
	canvasBoxBarreDefilement.style.minHeight = `${listeProjets.length * 30}px`;
}
*/
//console.log(canvasBoxBarreDefilement.style);


/* TODO: Connexion aux tables de grist à faire */
// ====================================
// ==== fonctions propres à Grist =====
// ====================================

function creerlisteProjets(tableauGrist, tableauProjets, colonnes){
	let projet = null;
	tableauGrist.forEach((ligne, i) => {
		projet = new Projet(ligne[colonnes.Projet],
			ligne[colonnes.DateDebut],
			ligne[colonnes.DateFin],
			ligne[colonnes.Agents],
			ligne[colonnes.Service],
			ligne[colonnes.SousDirection],
			ligne[colonnes.Quotite],
			ligne[colonnes.Priorite]);
		tableauProjets.push(projet);
	});

}

grist.ready({
  columns: colonnesNecessaires,
	requiredAccess: 'full',
	allowSelectBy: false
});

grist.onRecords((table, mappings) => {
	if (mappings) {
		tableau = table;
		colonnes = mappings;
		//nomTableau = ;
		creerlisteProjets(tableau, listeProjets, colonnes);
		// Création du diagramme après initialisation du module Grist:
		const myChart = new Chart(
		  document.getElementById('myChart'),
		  config
		);
		console.log('Grist onRecords');
		console.log(tableau);
		console.log(colonnes);
		console.log(listeProjets);
    }
	else{
		alert("Please map all columns")
	}
});
