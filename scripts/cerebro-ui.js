var CerebroUI = pc.createScript('cerebroUI');

CerebroUI.prototype.initialize = function () {
    this.buildStyles();
    this.buildMarkup();
    this.wireLogic();
};

CerebroUI.prototype.buildStyles = function () {
    var css = [
        '@import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap");',
        ':root{--bg:#0f0e14;--bg-2:#17151f;--panel:#1c1a26;--ink:#f1eef7;--ink-muted:#a49fb5;--ink-faint:#726d84;--line:#322e3f;',
        '--cortex:#7fb3d9;--cortex-dim:#2c3a45;--amigdala:#e6947a;--amigdala-dim:#402c26;--hipocampo:#c09be0;--hipocampo-dim:#362a45;--accumbens:#f0c065;--accumbens-dim:#40331f;--pos:#7bcf9e;--neg:#e6897a;',
        '--font-display:"Fraunces",Georgia,serif;--font-body:"Public Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--font-mono:"IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace;}',
        '#cerebro-root *{box-sizing:border-box;}',
        '#cerebro-root{position:fixed;inset:0;z-index:1000;background:var(--bg);color:var(--ink);font-family:var(--font-body);overflow-y:auto;padding-inline:16px;padding-block:28px 48px;display:flex;justify-content:center;}',
        '#cerebro-root canvas#synapse-bg{position:fixed;inset:0;z-index:0;opacity:0.5;pointer-events:none;}',
        '#cerebro-root .frame{position:relative;z-index:1;width:100%;max-width:460px;display:flex;flex-direction:column;gap:18px;}',
        '#cerebro-root .badge{align-self:center;font-family:var(--font-mono);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-faint);border:1px solid var(--line);border-radius:100px;padding:5px 14px;}',
        '#cerebro-root .hud{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px 14px;}',
        '#cerebro-root .hud-item{display:flex;flex-direction:column;gap:5px;align-items:center;}',
        '#cerebro-root .hud-code{font-family:var(--font-mono);font-size:11px;letter-spacing:0.06em;color:var(--ink-faint);}',
        '#cerebro-root .hud-bar{position:relative;width:100%;height:5px;border-radius:100px;border:1px solid var(--line);overflow:hidden;}',
        '#cerebro-root .hud-fill{position:absolute;inset:0;width:50%;background:var(--ink-muted);transition:width .8s cubic-bezier(.2,.8,.2,1);}',
        '#cerebro-root .hud-val{font-family:var(--font-mono);font-size:12px;font-variant-numeric:tabular-nums;color:var(--ink);}',
        '#cerebro-root .hud-delta{font-family:var(--font-mono);font-size:11px;font-variant-numeric:tabular-nums;opacity:0;transform:translateY(4px);transition:opacity .5s ease,transform .5s ease;height:14px;}',
        '#cerebro-root .hud-delta.show{opacity:1;transform:translateY(0);}',
        '#cerebro-root .hud-delta.pos{color:var(--pos);} #cerebro-root .hud-delta.neg{color:var(--neg);}',
        '#cerebro-root .panel{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:26px 24px;display:flex;flex-direction:column;gap:18px;}',
        '#cerebro-root .who{font-family:var(--font-mono);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-faint);}',
        '#cerebro-root .line{font-family:var(--font-display);font-style:italic;font-size:1.2rem;line-height:1.5;color:var(--ink);}',
        '#cerebro-root .btn{font-family:var(--font-body);font-weight:600;font-size:.95rem;color:var(--bg);background:var(--ink);border:none;border-radius:100px;padding:12px 22px;cursor:pointer;align-self:flex-start;}',
        '#cerebro-root .btn:hover{opacity:.88;}',
        '#cerebro-root h2{font-family:var(--font-display);font-weight:600;font-size:1.4rem;margin:0;}',
        '#cerebro-root .instr{color:var(--ink-muted);font-size:.92rem;margin-top:-8px;}',
        '#cerebro-root .pool{display:flex;flex-wrap:wrap;gap:10px;min-height:46px;}',
        '#cerebro-root .bubble{font-family:var(--font-body);font-size:.88rem;color:var(--ink);background:var(--bg-2);border:1px solid var(--line);border-radius:12px;padding:10px 14px;text-align:left;cursor:pointer;max-width:100%;}',
        '#cerebro-root .bubble.selected{border-color:var(--ink);box-shadow:0 0 0 1px var(--ink);}',
        '#cerebro-root .bubble.hidden-solved{display:none;}',
        '#cerebro-root .targets{display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
        '#cerebro-root .target{border-radius:12px;padding:13px 14px;text-align:left;cursor:pointer;background:var(--t-dim);border:1.5px solid var(--t-color);color:var(--t-color);display:flex;flex-direction:column;gap:6px;min-height:74px;}',
        '#cerebro-root .target .rname{font-family:var(--font-mono);font-size:11px;letter-spacing:.04em;text-transform:uppercase;}',
        '#cerebro-root .target .rslot{font-size:.82rem;color:var(--ink-muted);font-style:italic;}',
        '#cerebro-root .target.solved{cursor:default;} #cerebro-root .target.solved .rslot{color:var(--ink);font-style:normal;}',
        '#cerebro-root .target.shake{animation:cerebroShake .4s;}',
        '@keyframes cerebroShake{20%,60%{transform:translateX(-5px);}40%,80%{transform:translateX(5px);}}',
        '#cerebro-root .t-cortex{--t-color:var(--cortex);--t-dim:var(--cortex-dim);}',
        '#cerebro-root .t-amigdala{--t-color:var(--amigdala);--t-dim:var(--amigdala-dim);}',
        '#cerebro-root .t-hipocampo{--t-color:var(--hipocampo);--t-dim:var(--hipocampo-dim);}',
        '#cerebro-root .t-accumbens{--t-color:var(--accumbens);--t-dim:var(--accumbens-dim);}',
        '#cerebro-root .choices{display:flex;flex-direction:column;gap:10px;}',
        '#cerebro-root .choice{display:flex;align-items:center;gap:10px;background:var(--c-dim);border:1.5px solid var(--c-color);border-radius:12px;padding:13px 16px;text-align:left;cursor:pointer;color:var(--ink);font-family:var(--font-body);font-size:.92rem;}',
        '#cerebro-root .choice:hover{filter:brightness(1.15);}',
        '#cerebro-root .choice .dot{width:9px;height:9px;border-radius:50%;background:var(--c-color);flex:none;}',
        '#cerebro-root .outcome-line{font-family:var(--font-display);font-style:italic;font-size:1.15rem;color:var(--ink);}',
        '#cerebro-root [hidden]{display:none !important;}',
        '@media (max-width:380px){#cerebro-root .targets{grid-template-columns:1fr;}}'
    ].join('\n');

    var style = document.createElement('style');
    style.id = 'cerebro-style';
    style.textContent = css;
    document.head.appendChild(style);
};

CerebroUI.prototype.buildMarkup = function () {
    var root = document.createElement('div');
    root.id = 'cerebro-root';
    root.innerHTML =
        '<canvas id="synapse-bg"></canvas>' +
        '<div class="frame">' +
        '<span class="badge">Capítulo 1 · Conectar Sinapses</span>' +
        '<div class="hud">' +
        this.hudItem('AU') + this.hudItem('HF') + this.hudItem('CV') + this.hudItem('BE') +
        '</div>' +
        '<section class="panel" id="scene-intro">' +
        '<span class="who">Sua mãe</span>' +
        '<p class="line">"Já fiz sua matrícula no Aprova+ Medicina. Você vai me agradecer depois."</p>' +
        '<button class="btn" id="btn-to-match">Entrar na mente</button>' +
        '</section>' +
        '<section class="panel" id="scene-match" hidden>' +
        '<h2>Conectar Sinapses</h2>' +
        '<p class="instr">Toque em uma voz e depois na região de onde ela vem.</p>' +
        '<div class="pool" id="pool"></div>' +
        '<div class="targets" id="targets"></div>' +
        '<button class="btn" id="btn-to-decision" hidden>Continuar</button>' +
        '</section>' +
        '<section class="panel" id="scene-decision" hidden>' +
        '<h2>Qual voz vai guiar sua decisão?</h2>' +
        '<div class="choices" id="choices"></div>' +
        '</section>' +
        '<section class="panel" id="scene-outcome" hidden>' +
        '<span class="who">Resultado</span>' +
        '<p class="outcome-line" id="outcome-text"></p>' +
        '<button class="btn" id="btn-restart">Jogar de novo</button>' +
        '</section>' +
        '</div>';
    document.body.appendChild(root);
    this.root = root;
};

CerebroUI.prototype.hudItem = function (code) {
    return '<div class="hud-item"><span class="hud-code">' + code + '</span>' +
        '<div class="hud-bar"><div class="hud-fill" id="bar-' + code + '"></div></div>' +
        '<span class="hud-val" id="val-' + code + '">5</span>' +
        '<span class="hud-delta" id="delta-' + code + '"></span></div>';
};

CerebroUI.prototype.wireLogic = function () {
    var root = this.root;
    var q = function (sel) { return root.querySelector(sel); };

    var REGIONS = {
        cortex: { name: 'Córtex Pré-frontal', cls: 't-cortex' },
        amigdala: { name: 'Amígdala', cls: 't-amigdala' },
        hipocampo: { name: 'Hipocampo', cls: 't-hipocampo' },
        accumbens: { name: 'Núcleo Accumbens', cls: 't-accumbens' }
    };

    var BUBBLES = [
        { id: 'b1', region: 'cortex', text: 'Medicina dá estabilidade e é um curso longo — preciso planejar os próximos 6 anos direito.' },
        { id: 'b2', region: 'amigdala', text: 'E se eu decepcionar todo mundo? Tenho medo de decidir errado.' },
        { id: 'b3', region: 'hipocampo', text: 'Lembro de cuidar do meu avô doente e me sentir útil... mas também de odiar Biologia na 9ª série.' },
        { id: 'b4', region: 'accumbens', text: 'Eu queria mesmo é passar a tarde desenhando minhas histórias em quadrinhos.' }
    ];

    var CHOICES = [
        { region: 'cortex', label: 'Aceitar, mas negociar um ano de teste com ela',
          outcome: 'Você decide aceitar o cursinho — mas propõe um trato: um ano de teste, e depois vocês reavaliam juntos.',
          delta: { AU: -1, HF: 2, CV: 2, BE: 0 } },
        { region: 'amigdala', label: 'Aceitar sem questionar, para evitar a decepção dela',
          outcome: 'Você aceita sem dizer nada. Não quer nem imaginar a decepção dela se recusasse.',
          delta: { AU: -2, HF: 2, CV: -1, BE: -2 } },
        { region: 'hipocampo', label: 'Aceitar, reconectando com um motivo pessoal',
          outcome: 'Você aceita — mas agora pensando no seu avô, na vontade real de cuidar de alguém. Isso muda algo.',
          delta: { AU: 1, HF: 1, CV: 1, BE: 1 } },
        { region: 'accumbens', label: 'Recusar agora e pedir mais tempo',
          outcome: 'Você respira fundo e diz que precisa de mais tempo. Talvez o caminho seja outro — talvez seja o desenho.',
          delta: { AU: 3, HF: -3, CV: 1, BE: 2 } }
    ];

    var attrs = { AU: 5, HF: 5, CV: 5, BE: 5 };
    var selectedBubble = null;
    var solved = {};
    var solvedCount = 0;

    function renderHud() {
        Object.keys(attrs).forEach(function (k) {
            q('#bar-' + k).style.width = (attrs[k] * 10) + '%';
            q('#val-' + k).textContent = attrs[k];
        });
    }

    function buildMatch() {
        var pool = q('#pool');
        var targets = q('#targets');
        pool.innerHTML = '';
        targets.innerHTML = '';

        BUBBLES.forEach(function (b) {
            var el = document.createElement('button');
            el.className = 'bubble';
            el.id = 'bubble-' + b.id;
            el.textContent = b.text;
            el.addEventListener('click', function () { selectBubble(b.id, el); });
            pool.appendChild(el);
        });

        Object.keys(REGIONS).forEach(function (key) {
            var r = REGIONS[key];
            var el = document.createElement('button');
            el.className = 'target ' + r.cls;
            el.id = 'target-' + key;
            el.innerHTML = '<span class="rname">' + r.name + '</span><span class="rslot">solte aqui</span>';
            el.addEventListener('click', function () { tryPlace(key, el); });
            targets.appendChild(el);
        });
    }

    function selectBubble(id, el) {
        if (solved[id]) return;
        if (selectedBubble === id) {
            el.classList.remove('selected');
            selectedBubble = null;
            return;
        }
        Array.prototype.forEach.call(root.querySelectorAll('.bubble.selected'), function (b) { b.classList.remove('selected'); });
        el.classList.add('selected');
        selectedBubble = id;
    }

    function tryPlace(regionKey, targetEl) {
        if (targetEl.classList.contains('solved')) return;
        if (!selectedBubble) return;

        var bubble = BUBBLES.filter(function (b) { return b.id === selectedBubble; })[0];
        var bubbleEl = q('#bubble-' + bubble.id);

        if (bubble.region === regionKey) {
            solved[bubble.id] = true;
            solvedCount++;
            bubbleEl.classList.add('hidden-solved');
            targetEl.classList.add('solved');
            targetEl.querySelector('.rslot').textContent = bubble.text;
            selectedBubble = null;
            if (solvedCount === BUBBLES.length) {
                q('#btn-to-decision').hidden = false;
            }
        } else {
            targetEl.classList.remove('shake');
            void targetEl.offsetWidth;
            targetEl.classList.add('shake');
            bubbleEl.classList.remove('selected');
            selectedBubble = null;
        }
    }

    function buildDecision() {
        var wrap = q('#choices');
        wrap.innerHTML = '';
        CHOICES.forEach(function (c) {
            var el = document.createElement('button');
            el.className = 'choice';
            el.style.setProperty('--c-color', 'var(--' + c.region + ')');
            el.style.setProperty('--c-dim', 'var(--' + c.region + '-dim)');
            el.innerHTML = '<span class="dot"></span><span>' + c.label + '</span>';
            el.addEventListener('click', function () { resolveChoice(c); });
            wrap.appendChild(el);
        });
    }

    function resolveChoice(choice) {
        q('#scene-decision').hidden = true;
        q('#outcome-text').textContent = choice.outcome;
        q('#scene-outcome').hidden = false;

        Object.keys(choice.delta).forEach(function (k) {
            var d = choice.delta[k];
            attrs[k] = Math.max(0, Math.min(10, attrs[k] + d));
            var dEl = q('#delta-' + k);
            dEl.textContent = (d > 0 ? '+' : '') + d;
            dEl.classList.remove('pos', 'neg');
            dEl.classList.add(d >= 0 ? 'pos' : 'neg');
            requestAnimationFrame(function () { dEl.classList.add('show'); });
        });
        renderHud();
    }

    q('#btn-to-match').addEventListener('click', function () {
        q('#scene-intro').hidden = true;
        q('#scene-match').hidden = false;
    });

    q('#btn-to-decision').addEventListener('click', function () {
        q('#scene-match').hidden = true;
        buildDecision();
        q('#scene-decision').hidden = false;
    });

    q('#btn-restart').addEventListener('click', function () {
        attrs.AU = attrs.HF = attrs.CV = attrs.BE = 5;
        selectedBubble = null;
        solved = {};
        solvedCount = 0;
        Array.prototype.forEach.call(root.querySelectorAll('.hud-delta'), function (d) {
            d.classList.remove('show');
            d.textContent = '';
        });
        renderHud();
        buildMatch();
        q('#btn-to-decision').hidden = true;
        q('#scene-outcome').hidden = true;
        q('#scene-intro').hidden = false;
    });

    buildMatch();
    renderHud();
    this.startAmbientBackground();
};

CerebroUI.prototype.startAmbientBackground = function () {
    var canvas = this.root.querySelector('#synapse-bg');
    var ctx = canvas.getContext('2d');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var w, h, nodes;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    function makeNodes() {
        var colors = ['#7fb3d9', '#e6947a', '#c09be0', '#f0c065', '#4a4560'];
        var count = Math.min(26, Math.floor((w * h) / 42000));
        nodes = [];
        for (var i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                c: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }
    function tick() {
        ctx.clearRect(0, 0, w, h);
        nodes.forEach(function (n) {
            if (!reduceMotion) {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;
            }
        });
        for (var i = 0; i < nodes.length; i++) {
            for (var j = i + 1; j < nodes.length; j++) {
                var a = nodes[i], b = nodes[j];
                var d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 160) {
                    ctx.strokeStyle = 'rgba(140,130,170,' + (0.12 * (1 - d / 160)) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
        nodes.forEach(function (n) {
            ctx.fillStyle = n.c;
            ctx.globalAlpha = 0.55;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        if (!reduceMotion) requestAnimationFrame(tick);
    }

    resize();
    makeNodes();
    tick();
    window.addEventListener('resize', function () { resize(); makeNodes(); if (reduceMotion) tick(); });
};
