/**
 * CONTROLADOR DE INTERFAZ DEL TORNEO (TORNEO_UI.JS)
 * Cátedra de Nutrición Infantil - UNSTA
 * Conecta el motor de 100 alumnos con la vista del cuadro, tabla de grupos y arena
 */

class TournamentUI {
  constructor() {
    this.engine = window.tournamentEngine;
    this.activeMatchId = null;
    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.dom = {
      btnTabTournament: document.getElementById('btnTabTournament'),
      btnTabArena: document.getElementById('btnTabArena'),
      viewTournament: document.getElementById('viewTournament'),
      viewArena: document.getElementById('viewArena'),
      btnBackToTournament: document.getElementById('btnBackToTournament'),

      // Hero del día
      tourneyDayBadge: document.getElementById('tourneyDayBadge'),
      tourneyDayTitle: document.getElementById('tourneyDayTitle'),
      tourneyDayDesc: document.getElementById('tourneyDayDesc'),
      tourneyAliveCount: document.getElementById('tourneyAliveCount'),
      tourneyMatchCount: document.getElementById('tourneyMatchCount'),
      tourneyCountdown: document.getElementById('tourneyCountdown'),

      // Botones de Simulación Docente
      btnSimFirebase: document.getElementById('btnSimFirebase'),
      btnSimDemo: document.getElementById('btnSimDemo'),
      btnSimMidnight: document.getElementById('btnSimMidnight'),
      btnSimNextDay: document.getElementById('btnSimNextDay'),
      btnSimReset: document.getElementById('btnSimReset'),

      // Contenedores
      matchupsCountBadge: document.getElementById('matchupsCountBadge'),
      matchupsContainer: document.getElementById('matchupsContainer'),
      leaderboardTbody: document.getElementById('leaderboardTbody'),

      // Modal de Transparencia
      transparencyModal: document.getElementById('transparencyModal'),
      transparencyTitle: document.getElementById('transparencyTitle'),
      transparencySubtitle: document.getElementById('transparencySubtitle'),
      transparencyDetails: document.getElementById('transparencyDetails'),
      transparencySvg: document.getElementById('transparencySvg'),
      btnCloseTransparency: document.getElementById('btnCloseTransparency')
    };
  }

  bindEvents() {
    // Pestañas
    if (this.dom.btnTabTournament) {
      this.dom.btnTabTournament.addEventListener('click', () => this.switchView('tournament'));
    }
    if (this.dom.btnTabArena) {
      this.dom.btnTabArena.addEventListener('click', () => this.switchView('arena'));
    }
    if (this.dom.btnBackToTournament) {
      this.dom.btnBackToTournament.addEventListener('click', () => this.switchView('tournament'));
    }

    // Sincronización Segura de Alumnos y Fotos de Firebase (Solo Lectura)
    if (this.dom.btnSimFirebase) {
      this.dom.btnSimFirebase.addEventListener('click', async () => {
        if (!window.db) {
          alert('No se detectó la base de datos de Firebase Firestore. Asegúrate de tener conexión a internet.');
          return;
        }
        const prevText = this.dom.btnSimFirebase.textContent;
        this.dom.btnSimFirebase.disabled = true;
        this.dom.btnSimFirebase.textContent = '⏳ Leyendo alumnos y fotos de Firebase...';
        try {
          const res = await this.engine.loadRealStudentsFromFirebase(window.db);
          this.render();
          alert(`✅ ¡Alumnos y fotos de Firebase cargados con éxito!\n\n• Alumnos reales vinculados: ${res.playersCount}\n• Fotos de perfil cargadas: ${res.photosCount}\n• Grupos activos: 18\n\n🔒 Aislamiento Seguro: El torneo se ejecuta en Sandbox Local (localStorage). Ningún punto ni estado se alterará en la base de datos oficial.`);
        } catch (err) {
          console.error('Error al sincronizar con Firebase:', err);
          alert('No se pudo cargar desde Firebase: ' + err.message);
        } finally {
          this.dom.btnSimFirebase.disabled = false;
          this.dom.btnSimFirebase.textContent = prevText;
        }
      });
    }

    // Botones de simulación docente (Time Travel)
    if (this.dom.btnSimDemo) {
      this.dom.btnSimDemo.addEventListener('click', () => {
        this.engine.resetToInitialDemo();
        this.render();
      });
    }

    if (this.dom.btnSimMidnight) {
      this.dom.btnSimMidnight.addEventListener('click', () => {
        this.engine.advanceToMidnight();
        this.render();
      });
    }

    if (this.dom.btnSimNextDay) {
      this.dom.btnSimNextDay.addEventListener('click', () => {
        this.engine.nextDay();
        this.render();
      });
    }

    if (this.dom.btnSimReset) {
      this.dom.btnSimReset.addEventListener('click', () => {
        if (confirm('¿Deseas reiniciar el torneo completo a cero para el Día 1?')) {
          this.engine.resetToInitialDemo();
          this.render();
        }
      });
    }

    // Modal de transparencia
    if (this.dom.btnCloseTransparency) {
      this.dom.btnCloseTransparency.addEventListener('click', () => {
        this.dom.transparencyModal.style.display = 'none';
      });
    }
  }

  switchView(viewName) {
    if (viewName === 'tournament') {
      this.dom.viewTournament.style.display = 'block';
      this.dom.viewArena.style.display = 'none';
      this.dom.btnTabTournament.classList.add('active');
      this.dom.btnTabArena.classList.remove('active');
      this.render();
    } else {
      this.dom.viewTournament.style.display = 'none';
      this.dom.viewArena.style.display = 'flex';
      this.dom.btnTabTournament.classList.remove('active');
      this.dom.btnTabArena.classList.add('active');
    }
  }

  render() {
    const curDay = this.engine.state.day;
    const dayData = TOURNAMENT_DAYS_GAMES[curDay] || TOURNAMENT_DAYS_GAMES[1];
    const aliveCount = this.engine.getAlivePlayersCount();
    const matchups = this.engine.state.currentMatchups;

    // 1. Hero del Día
    if (this.dom.tourneyDayBadge) {
      this.dom.tourneyDayBadge.textContent = `DÍA ${curDay} DE 7 • ${dayData.category}`;
    }
    if (this.dom.tourneyDayTitle) {
      this.dom.tourneyDayTitle.textContent = dayData.title;
    }
    if (this.dom.tourneyDayDesc) {
      this.dom.tourneyDayDesc.textContent = dayData.desc;
    }
    if (this.dom.tourneyAliveCount) {
      this.dom.tourneyAliveCount.textContent = aliveCount;
    }
    if (this.dom.tourneyMatchCount) {
      this.dom.tourneyMatchCount.textContent = matchups.length;
    }
    if (this.dom.matchupsCountBadge) {
      this.dom.matchupsCountBadge.textContent = matchups.length;
    }

    // Botones de Time Travel: mostrar Next Day si ya se hizo medianoche
    if (this.dom.btnSimNextDay) {
      this.dom.btnSimNextDay.style.display = (this.engine.state.isSimulatedMidnight && curDay < 7) ? 'flex' : 'none';
    }
    if (this.dom.btnSimMidnight) {
      this.dom.btnSimMidnight.style.display = this.engine.state.isSimulatedMidnight ? 'none' : 'flex';
    }

    // 2. Renderizar Cruces (Matchups)
    this.renderMatchups(matchups);

    // 3. Renderizar Tabla de Grupos (Leaderboard)
    this.renderLeaderboard();
  }

  renderMatchups(matchups) {
    if (!this.dom.matchupsContainer) return;
    this.dom.matchupsContainer.innerHTML = '';

    const renderAvatar = (player, isP2) => {
      const color = isP2 ? 'var(--p2-color)' : 'var(--p1-color)';
      if (player.photo) {
        return `<img src="${player.photo}" class="player-avatar-thumb" alt="${player.firstName || player.name}" style="border: 1.5px solid ${color};" onerror="this.style.display='none'">`;
      }
      const initial = (player.firstName || player.name || '?').charAt(0).toUpperCase();
      return `<div class="player-avatar-initial" style="border: 1.5px solid ${color}; color: ${color};">${initial}</div>`;
    };

    matchups.forEach((m, idx) => {
      const card = document.createElement('div');
      card.className = `matchup-card ${m.status === 'finished' ? 'finished' : ''}`;

      let statusBadge = '';
      if (m.status === 'finished') {
        statusBadge = '<span class="matchup-status-tag status-finished">✅ Finalizado</span>';
      } else if (m.status === 'ready_to_reveal' || m.status.includes('played')) {
        statusBadge = '<span class="matchup-status-tag status-waiting">⏳ En Espera</span>';
      } else {
        statusBadge = '<span class="matchup-status-tag status-pending">⚡ Pendiente</span>';
      }

      const p1Winner = m.winnerId === m.player1.id;
      const p2Winner = m.winnerId === m.player2.id;

      let p1ScoreText = '-';
      let p2ScoreText = '-';
      if (m.revealed && m.p1Result) {
        p1ScoreText = `${m.p1Result.score} pts (${(m.p1Result.timeMs / 1000).toFixed(1)}s)`;
      }
      if (m.revealed && m.p2Result) {
        p2ScoreText = `${m.p2Result.score} pts (${(m.p2Result.timeMs / 1000).toFixed(1)}s)`;
      }

      card.innerHTML = `
        <div class="matchup-header">
          <span class="matchup-id-tag">CRUCE #${idx + 1}</span>
          ${statusBadge}
        </div>
        <div class="matchup-players">
          <div class="matchup-player-row ${p1Winner ? 'winner' : ''} ${m.revealed && !p1Winner ? 'loser' : ''}">
            <div class="player-info-cell">
              ${p1Winner ? '<span class="crown-badge">👑</span>' : ''}
              ${renderAvatar(m.player1, false)}
              <span class="player-name-text">${m.player1.firstName || m.player1.name}</span>
              <span class="group-badge-pill">G${m.player1.groupNum}</span>
            </div>
            <span class="player-score-cell">${p1ScoreText}</span>
          </div>
          <div class="matchup-player-row ${p2Winner ? 'winner' : ''} ${m.revealed && !p2Winner ? 'loser' : ''}">
            <div class="player-info-cell">
              ${p2Winner ? '<span class="crown-badge">👑</span>' : ''}
              ${renderAvatar(m.player2, true)}
              <span class="player-name-text">${m.player2.firstName || m.player2.name}</span>
              ${m.player2.groupNum ? `<span class="group-badge-pill">G${m.player2.groupNum}</span>` : ''}
            </div>
            <span class="player-score-cell">${p2ScoreText}</span>
          </div>
        </div>
        <div class="matchup-actions">
          ${m.status !== 'finished' ? `
            <button class="btn-play-match" data-match-id="${m.id}">
              ⚔️ Jugar este Duelo
            </button>
          ` : `
            <button class="btn-view-transparency" data-match-id="${m.id}">
              🔍 Ver Transparencia
            </button>
          `}
        </div>
      `;

      this.dom.matchupsContainer.appendChild(card);
    });

    // Eventos de botones dentro de tarjetas
    this.dom.matchupsContainer.querySelectorAll('.btn-play-match').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const matchId = e.currentTarget.getAttribute('data-match-id');
        this.startTournamentMatch(matchId);
      });
    });

    this.dom.matchupsContainer.querySelectorAll('.btn-view-transparency').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const matchId = e.currentTarget.getAttribute('data-match-id');
        this.openTransparencyModal(matchId);
      });
    });
  }

  renderLeaderboard() {
    if (!this.dom.leaderboardTbody) return;
    this.dom.leaderboardTbody.innerHTML = '';

    const sortedGroups = this.engine.getLeaderboardGroups();
    sortedGroups.forEach((g, rank) => {
      const tr = document.createElement('tr');
      let medal = `#${rank + 1}`;
      if (rank === 0) medal = '🥇 1°';
      if (rank === 1) medal = '🥈 2°';
      if (rank === 2) medal = '🥉 3°';

      tr.innerHTML = `
        <td style="font-weight: 800;">${medal}</td>
        <td>
          <span style="font-weight: 700; color: #fff;">${g.name}</span>
        </td>
        <td>
          <span class="alive-badge-pill">${g.activePlayersCount} vivos</span>
        </td>
        <td>
          <span class="xp-badge-pill">+${g.xpWon} XP</span>
        </td>
      `;
      this.dom.leaderboardTbody.appendChild(tr);
    });
  }

  // Comienza la batalla interactiva en el esqueleto para un cruce específico
  startTournamentMatch(matchId) {
    const match = this.engine.state.currentMatchups.find(m => m.id === matchId);
    if (!match) return;

    this.activeMatchId = matchId;

    // Configurar jugadores en el estado general del juego
    if (window.state) {
      window.state.p1Name = `${match.player1.firstName || match.player1.name} (G${match.player1.groupNum})`;
      window.state.p2Name = `${match.player2.firstName || match.player2.name} (G${match.player2.groupNum || '?'})`;
      window.state.p1Photo = match.player1.photo || null;
      window.state.p2Photo = match.player2.photo || null;
      window.state.mode = 'duel';
      window.state.currentMatchId = matchId;
      
      // Asignar los juegos del día actual del torneo
      const dayGames = TOURNAMENT_DAYS_GAMES[this.engine.state.day]?.games || [];
      if (dayGames.length > 0) {
        window.state.activeLandmarks = [...dayGames];
        window.state.roundsCount = dayGames.length;
      }
    }

    // Cambiar a la arena
    this.switchView('arena');

    // Iniciar partida
    if (typeof window.startNewGame === 'function') {
      window.startNewGame();
    }
  }

  // Abre el modal de transparencia con los esqueletos comparativos
  openTransparencyModal(matchId) {
    const match = this.engine.state.currentMatchups.find(m => m.id === matchId);
    if (!match || !match.revealed) return;

    if (!this.dom.transparencyModal) return;

    this.dom.transparencyTitle.textContent = `Resultado Oficial: ${match.player1.name} vs ${match.player2.name}`;
    const p1Score = match.p1Result ? match.p1Result.score : 0;
    const p2Score = match.p2Result ? match.p2Result.score : 0;
    const winnerName = match.winnerId === match.player1.id ? match.player1.name : match.player2.name;

    this.dom.transparencySubtitle.innerHTML = `
      🏆 <strong>Victoria oficial de: ${winnerName}</strong> (+1 XP concedido al grupo)<br>
      <span style="font-size: 12px; color: #94a3b8;">Los registros milimétricos quedaron sellados a las 00:00 hs de forma pública.</span>
    `;

    const p1DistText = match.p1Result?.isTrivia ? (match.p1Result?.isCorrect ? '✅ Criterio Correcto' : '❌ Criterio Erróneo') : `${match.p1Result?.dist || 0} px`;
    const p2DistText = match.p2Result?.isTrivia ? (match.p2Result?.isCorrect ? '✅ Criterio Correcto' : '❌ Criterio Erróneo') : `${match.p2Result?.dist || 0} px`;

    this.dom.transparencyDetails.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; text-align: left;">
        <div style="background: rgba(6, 182, 212, 0.1); border-left: 3px solid #06b6d4; padding: 10px 14px; border-radius: 8px;">
          <strong style="color: #06b6d4;">${match.player1.name}:</strong><br>
          • Puntuación: <strong>${p1Score} pts</strong><br>
          • Desvío / Precisión: <strong>${p1DistText}</strong><br>
          • Tiempo contrarreloj: <strong>${((match.p1Result?.timeMs || 0) / 1000).toFixed(2)}s</strong>
        </div>
        <div style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; padding: 10px 14px; border-radius: 8px;">
          <strong style="color: #f59e0b;">${match.player2.name}:</strong><br>
          • Puntuación: <strong>${p2Score} pts</strong><br>
          • Desvío / Precisión: <strong>${p2DistText}</strong><br>
          • Tiempo contrarreloj: <strong>${((match.p2Result?.timeMs || 0) / 1000).toFixed(2)}s</strong>
        </div>
      </div>
    `;

    this.dom.transparencyModal.style.display = 'flex';
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.tournamentUI = new TournamentUI();
});
