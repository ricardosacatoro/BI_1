/* Temporada sintética reproducible para demostración educativa. */
(() => {
  const teams = [
    { id: 'barcelona', name: 'Barcelona SC', strength: 88, stadium: 27000, scorers: ['Mateo Cedeño', 'Bruno Vera', 'Joaquín León'] },
    { id: 'ldu', name: 'LDU Quito', strength: 86, stadium: 18000, scorers: ['Sebastián Rivas', 'Tomás Almeida', 'Andrés Vaca'] },
    { id: 'independiente', name: 'Independiente del Valle', strength: 84, stadium: 11500, scorers: ['Nicolás Arias', 'Gabriel Ponce', 'Kevin Minda'] },
    { id: 'emelec', name: 'Emelec', strength: 81, stadium: 21000, scorers: ['David Macías', 'Ángel Cárdenas', 'Joel Zambrano'] },
    { id: 'aucas', name: 'Aucas', strength: 77, stadium: 12500, scorers: ['Luis Chicaiza', 'Marco Angulo', 'Jhonny Quiñónez'] },
    { id: 'universidad-catolica', name: 'Universidad Católica', strength: 76, stadium: 8500, scorers: ['Daniel Valencia', 'Pablo Guerrero', 'Edison Vega'] },
    { id: 'mushuc-runa', name: 'Mushuc Runa', strength: 72, stadium: 6200, scorers: ['Carlos Feraud', 'Adrián Bone', 'Jorge Paredes'] },
    { id: 'delfin', name: 'Delfín SC', strength: 71, stadium: 8200, scorers: ['Enzo Gutiérrez', 'Luis Castro', 'Javier Sanguinetti'] },
    { id: 'orense', name: 'Orense SC', strength: 70, stadium: 7800, scorers: ['Miguel Parrales', 'Byron Palacios', 'Richard Calderón'] },
    { id: 'tecnico', name: 'Técnico Universitario', strength: 68, stadium: 6500, scorers: ['Jean Carlos Blanco', 'Eber Caicedo', 'Alex Rangel'] },
    { id: 'macara', name: 'Macará', strength: 68, stadium: 7200, scorers: ['Federico Paz', 'Jorge Valencia', 'Leonardo Cortés'] },
    { id: 'deportivo-cuenca', name: 'Deportivo Cuenca', strength: 67, stadium: 11000, scorers: ['Raúl Becerra', 'Lucas Mancinelli', 'Pablo Magnín'] },
    { id: 'libertad', name: 'Libertad FC', strength: 64, stadium: 5700, scorers: ['Anderson Naula', 'Renny Jaramillo', 'Armando Angulo'] },
    { id: 'cumbaya', name: 'Cumbayá FC', strength: 62, stadium: 4200, scorers: ['Brandon Perea', 'Darwin Suárez', 'Fernando Guerrero'] },
    { id: 'imabura', name: 'Imbabura SC', strength: 61, stadium: 5000, scorers: ['Leandro Pantoja', 'Jonathan Benítez', 'Kevin Rodríguez'] },
    { id: 'nacional', name: 'El Nacional', strength: 75, stadium: 14500, scorers: ['Jhon Jairo Cifuente', 'Byron Palacios', 'Ely Esterilla'] }
  ];

  function seededValue(seed) {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  }

  function makeSchedule() {
    const rotation = Array.from({ length: teams.length }, (_, index) => index);
    const firstHalf = [];
    for (let round = 0; round < teams.length - 1; round += 1) {
      const fixtures = [];
      for (let match = 0; match < teams.length / 2; match += 1) {
        let home = rotation[match];
        let away = rotation[teams.length - 1 - match];
        if ((round + match) % 2 === 1) [home, away] = [away, home];
        fixtures.push({ home, away });
      }
      firstHalf.push(fixtures);
      rotation.splice(1, 0, rotation.pop());
    }
    return [...firstHalf, ...firstHalf.map((round) => round.map(({ home, away }) => ({ home: away, away: home })))];
  }

  const goalTotals = new Map();
  const matches = [];
  makeSchedule().forEach((fixtures, roundIndex) => {
    fixtures.forEach(({ home: homeIndex, away: awayIndex }, fixtureIndex) => {
      const homeTeam = teams[homeIndex];
      const awayTeam = teams[awayIndex];
      const matchSeed = roundIndex * 8 + fixtureIndex + 1;
      const homeAdvantage = 0.2;
      const homeChance = seededValue(matchSeed * 2.11);
      const awayChance = seededValue(matchSeed * 3.17);
      const homeGoals = Math.max(0, Math.min(5, Math.floor(homeChance * 3.25 + (homeTeam.strength - awayTeam.strength) / 85 + homeAdvantage)));
      const awayGoals = Math.max(0, Math.min(4, Math.floor(awayChance * 2.8 + (awayTeam.strength - homeTeam.strength) / 100)));
      const homeScorers = Array.from({ length: homeGoals }, (_, goalIndex) => {
        const scorer = homeTeam.scorers[seededValue(matchSeed * 17 + goalIndex * 3 + 1) < .58 ? 0 : 1 + Math.floor(seededValue(matchSeed * 19 + goalIndex * 7) * 2)];
        goalTotals.set(scorer, (goalTotals.get(scorer) || 0) + 1);
        return scorer;
      });
      const awayScorers = Array.from({ length: awayGoals }, (_, goalIndex) => {
        const scorer = awayTeam.scorers[seededValue(matchSeed * 23 + goalIndex * 5 + 2) < .58 ? 0 : 1 + Math.floor(seededValue(matchSeed * 29 + goalIndex * 11) * 2)];
        goalTotals.set(scorer, (goalTotals.get(scorer) || 0) + 1);
        return scorer;
      });
      const homeCards = Math.floor(seededValue(matchSeed * 31) * 4);
      const awayCards = Math.floor(seededValue(matchSeed * 37) * 4);
      matches.push({
        id: `F${roundIndex + 1}-P${fixtureIndex + 1}`,
        round: roundIndex + 1,
        date: `Fecha ${roundIndex + 1}`,
        homeId: homeTeam.id,
        awayId: awayTeam.id,
        homeGoals,
        awayGoals,
        homeCards,
        awayCards,
        attendance: Math.round((homeTeam.stadium * (.52 + seededValue(matchSeed * 41) * .46)) / 100) * 100,
        homeScorers,
        awayScorers
      });
    });
  });

  const topScorers = [...goalTotals.entries()]
    .map(([name, goals]) => ({ name: name.trim(), goals, team: teams.find((team) => team.scorers.some((scorer) => scorer.trim() === name.trim()))?.name || '' }))
    .sort((first, second) => second.goals - first.goals || first.name.localeCompare(second.name, 'es'));

  window.LIGA_PRO_DATA = Object.freeze({ teams, matches, topScorers, totalRounds: 30 });
})();
