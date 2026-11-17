# Decisões técnicas

Registro curto de decisões com impacto duradouro no template ou nos projetos derivados. As regras comuns estão no [AGENTS.md](../AGENTS.md), seção "Colaboração Claude Code + Codex"; este arquivo não as substitui nem concede autorização para executar mudanças.

Use uma entrada apenas quando houver decisão relevante nos temas definidos no AGENTS.md. Ajustes rotineiros dispensam registro. Não incluir credenciais, URLs autenticadas ou dados confidenciais de clientes.

## Formato de uma entrada

- **Data, título e estado:** proposta, adotada ou substituída; indicar eventual sucessora.
- **Contexto e referência:** problema, responsável, caminhos e commit/PR ou HEAD de base com diff identificado.
- **Decisão e motivo:** solução escolhida e alternativa relevante descartada.
- **Impacto:** compatibilidade, dados, desempenho e projetos derivados, conforme aplicável.
- **Autorização:** quem autorizou e em qual pedido/referência, quando exigida.
- **Validação e retorno seguro:** verificações executadas e resultados, pendências, limites e como desfazer a mudança sem remover trabalho alheio.

## 2026-11-13 — Instruções comuns para Claude Code e Codex

- **Estado:** homologação concluída; aprovação final pelo Claude Code em 13/11/2026, com resultado **APROVADO** e ressalvas corrigidas e validadas.
- **Contexto e referência:** os dois agentes trabalham no mesmo template e precisam de instruções e passagem explícitas. Implementador: Codex. Base do template: `7e3281738a30d44fc96b59d81d35aa5d634121ac`; entrega sem commit identificada pelo acréscimo da seção "Colaboração Claude Code + Codex" ao AGENTS.md e pela criação deste arquivo.
- **Decisão e motivo:** centralizar as regras no AGENTS.md e manter CLAUDE.md somente com `@AGENTS.md`. Registrar aqui apenas decisões duradouras, evitando duas políticas técnicas paralelas.
- **Impacto:** exclusivamente documental. As regras técnicas anteriores e o mecanismo de criação de derivados são preservados; não há alteração de aplicação, dependências, dados ou infraestrutura.
- **Autorização:** responsável pelo template, nos pedidos "Cardeal Map — Implantação do Protocolo Claude Code + Codex" e "Cardeal Map — Ajustes finais do Protocolo de Colaboração", limitados à Fase 1 documental e às suas ressalvas; no pedido "Cardeal Map — Homologação e Commit da Fase 1", autorizou o commit local exclusivamente de AGENTS.md e docs/DECISOES.md, sem push ou avanço para outras fases.
- **Revisão independente — 13/11/2026:** realizada pelo Claude Code, com resultado **APROVADO COM RESSALVAS**, conforme comunicado pelo responsável no pedido de ajustes finais. As ressalvas documentais abrangem a exceção de `safe.directory` por comando de leitura, os meios de passagem de contexto e o uso de temporários externos em operações auxiliares de leitura/comparação.
- **Correções aplicadas — 13/11/2026:** explicitados esses três pontos no AGENTS.md, com bloqueio da exceção para escrita e orientação para relatar impedimentos. Acrescentadas orientações sobre a origem das decisões herdadas e a ausência de atualização documental automática nos derivados antigos. As ressalvas foram corrigidas e validadas pelo Claude Code na aprovação final de 13/11/2026.
- **Validação e retorno seguro:** a validação documental da implantação incluiu releitura e conferência de diff/estado Git; a preservação byte a byte refere-se ao snapshot local anterior à Fase 1, com CRLF, enquanto o blob Git usa LF. CLAUDE.md foi preservado e as alterações preexistentes foram conferidas por hashes. Instalação, build e testes da aplicação não integram esta fase. Se houver revisão desta decisão, modificar somente os acréscimos documentais identificados, preservando o conteúdo técnico anterior e quaisquer alterações posteriores de terceiros.
- **Homologação final — 13/11/2026:** revisão independente concluída pelo Claude Code, com veredito **APROVADO**, conforme comunicado pelo responsável no pedido de homologação. Ressalvas corrigidas e validadas; confirmação final concluída. O commit documental local foi autorizado pelo responsável, exclusivamente para AGENTS.md e docs/DECISOES.md. Push, merge, publicação e demais fases não estão autorizados.

## 2026-11-13 — Skills: fonte canônica `.agents/skills` e espelho físico `.claude/skills`

- **Estado:** implementada sem commit; revisão independente das correções realizada pelo Codex em 16/11/2026, **APROVADO COM RESSALVAS**, sem bloqueador para utilizar o criador de projetos. A reprovação inicial e as correções permanecem registradas abaixo como histórico. Commit e publicação continuam dependendo de autorização própria.
- **Contexto e referência:** as 15 junctions de `.claude/skills` apontavam, por caminho absoluto, para `C:\Users\Usuario\Desktop\cardeal-map-template\.agents\skills\...`, inexistente após a mudança da pasta para `projetos\`. As skills Cesium não carregavam no Claude Code e o Git listava os 26 arquivos como apagados. O `new-project.ps1` seguia o destino das junctions e não conferia o resultado: `campinas-2-webgis` (06/11/2026) ficou com 15 pastas de skills vazias e um primeiro commit sem skills. Implementador: Claude Code. Base: `f28a2b00925a991a94f2c6fbb8c791d4bbab5a79`. Arquivos: `.claude/skills/` (restauração física, sem diff contra HEAD), `scripts/sync-skills.cjs` (novo), `scripts/new-project.ps1`, `AGENTS.md`, `docs/CESIUM_VECTOR_TILES_2026.md` e esta entrada.
- **Decisão e motivo:** `.agents/skills` é a fonte canônica (lida pelo Codex, idêntica ao HEAD, frontmatter entre aspas em linha única). `.claude/skills` é um espelho físico versionado: o Git já guardava essas skills como 26 arquivos regulares, com a mesma árvore de `.agents/skills` (`36ce84a`), logo a migração não altera nenhum blob. Alternativas descartadas: junctions (só caminhos absolutos; foi o que quebrou); symlinks relativos (`core.symlinks=false` faz o checkout gerar arquivos de texto, exigem privilégio no Windows e o robocopy `/XJ` os exclui); referência fora do projeto (`~/.claude/skills` ou plugin), que tornaria o derivado dependente da máquina e não atende o Codex. `agent/skills` difere apenas na formatação do frontmatter YAML, sem conteúdo exclusivo; permanece temporariamente, fora da sincronização.
- **Segurança (após as correções):**
  - `--check` (padrão) só lê. Compara inventário e SHA-256 e valida a estrutura de cada skill na fonte e no espelho: diretório físico, `SKILL.md`, frontmatter delimitado e legível, `name` e `description` presentes e `name` igual ao diretório. Árvores idênticas sem skill utilizável retornam 2.
  - `--apply` só usa o Git quando `--root` é a raiz do repositório (`rev-parse --show-toplevel`). Raiz aninhada é recusada, inclusive com `--allow-dirty-source`.
  - A fonte é conferida por conteúdo contra o HEAD: `git ls-tree` comparado com `git hash-object` dos arquivos encontrados no disco. Arquivo alterado (inclusive escondido do `git status`), ausente, não rastreado ou ignorado bloqueia a operação, salvo `--allow-dirty-source` explícito.
  - Uma skill do espelho só é substituída quando todos os seus arquivos têm o conteúdo do HEAD, reconferido por SHA-256 imediatamente antes do rename.
  - Nunca segue links, não remove skill que exista só no espelho e não sobrescreve conteúdo desconhecido ou alterado.
  - O rollback desfaz só o que foi feito (staging, backup, troca, espelho criado nesta operação) e confere o espelho byte a byte contra o estado anterior. Só então declara "restaurado e verificado". Se algo não puder ser desfeito, mantém as cópias de segurança em `.claude/.skills-sync-*`, relata a recuperação como incompleta e bloqueia novos `--apply` até a conferência manual.
  - As junctions foram removidas uma a uma por `rmdir` não recursivo, depois de confirmar por `lstat`/`readlink` que eram links com destino externo e inexistente.
- **Impacto:** nenhuma alteração em `src/`, dependências, `package.json`/`package-lock.json`, `skills-lock.json`, `agent/skills` ou derivados existentes. Nos novos derivados, `.claude/skills` é copiado de `.agents/skills`; o espelho do template é excluído do robocopy. O `new-project.ps1` faz três conferências:
  - antes do `git init`: inventário e SHA-256 das duas árvores do derivado contra a origem canônica do template, ausência de links e `sync-skills.cjs --check`;
  - antes do commit: caminhos e blobs do índice (`git ls-files -s`) contra `git hash-object` dos arquivos verificados;
  - depois do commit: os blobs do HEAD.
  - Se o primeiro commit falhar, o script agora termina com erro (antes emitia só um aviso). Os derivados já afetados (`campinas-2-webgis`, `aliehs-webgis`, `andrelandia-webgis`, `fazenda-cafe`, `cambuci-webgis`, `jurema-webgis`) exigem tarefas próprias em cada projeto.
- **Autorização:** responsável pelo template, no pedido "Cardeal Map — Fase 2: Implementação Segura das Skills". Sem commit, push, merge ou alteração de derivados existentes.
- **Revisão independente — 13/11/2026:** o Codex reprovou a primeira implementação para commit. Os pontos apontados foram:
  - caminhos inconsistentes entre `git status` e `git ls-tree` com `--root` em subpasta de outro repositório, o que permitia classificar como íntegra uma edição local do espelho;
  - integridade da fonte deduzida só do `git status`;
  - rollback que falhava quando o espelho não existia e a falha ocorria na preparação;
  - `--check` que aceitava árvores idênticas sem skills utilizáveis;
  - `new-project.ps1` conferindo só contagens;
  - registro incorreto sobre o lockfile.
- **Correções aplicadas — 13/11/2026:** foram feitas alterações em `scripts/sync-skills.cjs`, `scripts/new-project.ps1` e nesta entrada. A revisão independente posterior reprovou o retorno antecipado de `--apply`, a validação YAML e a promessa de rollback. Os três pontos receberam ajustes; nova revisão independente permanece pendente.
- **Formato de frontmatter suportado:** subconjunto deliberadamente restrito: delimitadores `---`, somente os campos obrigatórios `name` e `description`, cada um em linha única, sem comentários ou outros campos. `name` começa por letra ASCII minúscula, contém somente letras ASCII minúsculas, números e hífens, sem hífens consecutivos ou finais, tem no máximo 64 caracteres, não pode ser `true`, `false` ou `null` e deve corresponder à pasta. `description` é string entre aspas duplas com sintaxe JSON ou texto simples ASCII iniciado por letra, contendo apenas letras, números, espaços, vírgulas, pontos e hífens, exceto os valores reservados `null`, `true` e `false`. Outras construções YAML, inclusive aspas simples e frontmatter multilinha, são rejeitadas. A restrição evita um parser YAML incompleto e dispensa instalação antes da criação de derivados; as 15 skills atuais seguem esse formato. A validação aguarda revisão independente.
- **Lockfile:** o Codex reproduziu os 15 `computedHash` do `skills-lock.json`. Não há divergência comprovada no lockfile. A afirmação anterior desta entrada estava errada: a tentativa usou metodologia insuficiente. A sonda procurava pastas com nome errado e não chegou a comparar nenhuma skill. Refazendo, os 15 hashes foram reproduzidos como SHA-256 de caminho relativo + conteúdo de cada arquivo, ordenados por `localeCompare`, sobre os bytes da árvore de trabalho (CRLF, `core.autocrlf=true`). Isso também mostra que o hash depende das quebras de linha do checkout.
- **Validação e retorno seguro:**
  - **Revisão independente final — 16/11/2026 (Codex):** inspeção direta dos dois scripts, documentação e estado Git, base `f28a2b0` mais alterações locais. Quinze testes independentes em diretórios descartáveis passaram: check e idempotência; raiz Git aninhada; fonte ignorada, desconhecida, alterada e ausente; rollback com espelho ausente em seis pontos; preservação de edição local; árvores sem SKILL.md e frontmatter inválido. O criador produziu derivado descartável com 26 arquivos Claude no primeiro commit e check aprovado; testes de arquivo excluído do índice e hook recusando commit retornaram erro (1), como esperado. Não há bloqueador identificado para criar Maue. Ressalvas: parser aceita somente o subconjunto de frontmatter documentado; check compara estrutura e espelhos, enquanto a integridade contra HEAD é exigida no apply; não foram revalidados checkout em outra máquina, concorrência de escritores ou travamentos reais do sistema. Registros anteriores de revisão pendente referem-se às versões anteriores. Alterações preexistentes foram preservadas, inclusive package.json, package-lock.json e settings locais. Integração ao npm run check permanece tarefa separada.
  - **No template:** `--check` = 0, `--apply` = 0 sem escrita e `git diff --quiet HEAD` em `.claude/skills` e `.agents/skills`. As 15 skills Cesium passaram a aparecer na lista de skills da sessão do Claude Code depois da migração.
  - **Registro histórico:** `sync-skills.cjs`, em fixtures descartáveis com espaço e "ç" no caminho: 75 testes aprovados na implementação anterior do validador. O formato atual rejeita frontmatter multilinha. Os testes históricos cobriram:
    - raiz aninhada;
    - fonte com arquivo ignorado, alterado, staged, ausente, não rastreado ou escondido por `assume-unchanged`;
    - espelho ausente, com falhas em 7 pontos;
    - espelho existente, com falhas em 9 pontos: antes, durante e depois do staging, entre backup e troca, depois da troca e antes da limpeza;
    - falha durante a própria recuperação;
    - árvores idênticas sem `SKILL.md` válido e 8 variações de frontmatter inválido;
    - aceitação do frontmatter em várias linhas (estilo `agent/skills`);
    - repetição sem efeito depois de aplicar;
    - preservação de conteúdo alterado ou desconhecido, inclusive escondido do `git status`;
    - junctions, resíduos e skill que só existe no espelho.
  - **`new-project.ps1`, num clone descartável e a partir do template:**
    - o derivado tem 26 + 26 arquivos no commit, com blobs iguais aos canônicos do template;
    - `--check` = 0 antes e depois de mover o derivado;
    - arquivo deixado fora do índice por regra de exclusão: aborta sem commit;
    - hook recusando o commit: termina com erro;
    - aborta antes do `git init` com divergência real da cópia, frontmatter inválido, link ou fonte vazia.
  - **Não verificados:** colisão de maiúsculas e minúsculas (o NTFS não permite criá-la), checkout em outra máquina e caminhos não ASCII dentro das skills no `new-project.ps1` (o PowerShell 5.1 decodifica a saída do Git pela página de código do console; as skills atuais só têm nomes ASCII). Pendente, em tarefa separada por haver alterações preexistentes em `package.json`: incluir `node scripts/sync-skills.cjs --check` no `npm run check`. Retorno seguro: `git restore -- scripts/new-project.ps1 AGENTS.md docs/CESIUM_VECTOR_TILES_2026.md docs/DECISOES.md` e remoção de `scripts/sync-skills.cjs`, mediante autorização; `.claude/skills` não tem diff a desfazer.

## 2026-11-16 — Joy: preparação da análise macro para upload

- **Estado/autorização:** responsável enviou onze GeoJSON para preparar, retornar e publicar manualmente no Cloudflare. Arquivos em r2-upload/geojson; URLs/CORS e integração no mapa pendentes do caminho confirmado. Sem alteração na análise micro, câmera, rasters ou configuração ativa do Joy.
- **Decisão:** dez arquivos IBGE/ANA/simulações copiados byte a byte, conforme docs/NOVO-PROJETO.md. Seus esquemas correspondem aos dez presets Macro existentes. Preservados IDs, atributos, unidades, STRAHLER, STREAM_ID, vértices e CRS84. Sem simplificação ou recorte. Z da simulação de drenagem mantido no arquivo; drapeamento futuro via ignoreAltitude na cópia de renderização, sem alegação de transformação vertical.
- **Curvas de 10 m:** cópia de visualização pelo prepare-geojson existente (tipo curvas, mestras a 50 m), mantendo mestre intacto. Remove Z e arredonda a 7 casas apenas na cópia; ELEVATION conservado e cota_m derivado, vínculo por source_ref e registro de atributos originais no manifesto. Datum vertical não informado. Sem preset Macro próprio para curvas: popup não configurado nesta etapa, sem inventar enquadramento em outro tema.
- **Validação:** 11 JSON UTF-8/CRS84, 515 geometrias não vazias e válidas no Shapely 2.1.2/GEOS 3.14.1; conferência de hashes, contagens e coordenadas finitas. Fontes reconferidas após gerar, intactas. Manifesto em docs/joy-macro-upload.json. Sem teste de mapa, transferência ou CORS porque o upload ainda não ocorreu.
- **Impacto/retorno:** apenas pacote de dados e documentação; nenhum código genérico/dependência/template alterado. Para desfazer, retirar somente o pacote e registros desta preparação, preservando todas as alterações anteriores do projeto.

## 2026-11-16 — Joy: conexão da Análise Macro ao R2

- **Autorização/estado:** responsável confirmou os onze arquivos em joy/geojson no Cloudflare. Configuradas onze camadas desligadas no início, group macro; futura seção vector denominada Análise Micro. Câmera/Home e rasters preservados; sem commit/deploy.
- **Configuração:** URLs públicas /geojson/*.geojson, preenchimentos discretos e contornos, opacidade em polígonos, preset de cada tema. IDs de renderização por camada e ignoreAltitude usam o preparador existente em cópia de memória, preservando os arquivos e atributos originais. Drenagem simulada reutiliza simbologia Strahler; não recalcula rede.
- **Novo esquema:** adicionado preset compartilhado macro-contours em src/projects/macroPopups.ts e types.ts para curvas, somente cota_m com unidade m. Presets anteriores preservados integralmente, sem popup por projeto. Eventual adoção desse preset no template requer tarefa separada.
- **Validação remota:** onze respostas HTTP 200, hashes SHA-256 idênticos aos preparados, contagens corretas e Access-Control-Allow-Origin: *. Content-Type entregue como application/octet-stream; conteúdo JSON verificado, carregamento via fetchJson suportado. Preferível configurar application/geo+json nos metadados, sem bloqueio identificado. Validação visual e testes da aplicação relatados na entrega.
- **Retorno seguro:** retirar somente ...macroLayers de layers, mantendo registros/arquivos e demais alterações locais; o preset novo não interfere nas camadas anteriores.
- **Validação de integração:** npm run check e npm run build (inclui typecheck) aprovados. Chromium headless em preview temporário: seção Análise Macro com 11 controles inicialmente desligados, três ciclos ON/OFF (município, drenagem ANA e curvas) e acesso ao painel mobile aprovados. O teste curto não observou conclusão das requisições GeoJSON no navegador; desenho final sobre terreno, alinhamento e interação real dos popups não contam como validados. A acessibilidade e integridade remotas dos 11 arquivos foram verificadas separadamente por HTTP, hashes e CORS. Servidor temporário encerrado.

## 2026-11-16 — Joy: DEM Macro na Análise Macro

- **Autorização/decisão:** responsável forneceu macro.xml e confirmou tiles no R2 em dem_macro. Adicionado DEM Macro no início da seção Macro, desligado na abertura e com opacidade; sem mudar câmera/Home, rasters existentes ou polígonos.
- **Fonte:** EPSG:900913, PNG 256×256, TMS (reverseY), níveis 6–15. Extensão do XML convertida para graus somente como bounds do raster, nunca limite do projeto. Raster de cores não passa a fornecer altitudes às ferramentas de medição.
- **Validação:** scripts/raster-from-xml.cjs confirmou HTTP 200, PNG e CORS * no tile 6/23/27 para origens locais dev e preview. Legenda do DEM Macro não informada; nenhuma classe ou imagem de legenda inventada. Verificações da aplicação relatadas na entrega; conferência visual sobre o terreno permanece pendente.
- **Retorno:** remover somente a entrada dem-macro de macroLayers. Sem alteração de dependências, template, fontes, commit ou publicação.

## 2026-11-16 — Joy: preparação da Análise Micro

- **Autorização/estado:** responsável forneceu curvas 2 m, curvas 3 m, perímetro e rede de drenagem; CAR será enviado depois. Pacote em r2-upload/geojson/micro para upload manual, sem alterar ainda camadas ativas, câmera, rasters ou Macro.
- **Transformações:** preparador existente, cópias 2D a 7 casas para visualização drapeada, sem simplificação ou reprojeção; curvas com cota_m e mestras de 10 m (curvas 2 m) / 15 m (curvas 3 m). STRAHLER e STREAM_ID preservados; comprimento_m calculado e DRAIN_AREA convertido conforme unidade ha para popup. Nome do perímetro vem de nome_area; atributos cadastrais intactos. Z removido só nas cópias, sem transformação vertical; datum desconhecido.
- **Rastreabilidade:** hashes, parâmetros e mapeamento de source_ref para cada índice/atributos originais em docs/joy-micro-upload.json. Fontes preservadas byte a byte. Campo municipio_ do perímetro é 3110608, diferente do código 3133600 da base municipal macro de Itapeva; mantido sem correção automática.
- **Validação:** contagens, geometria e coordenadas comparadas, cotas e ordem de Strahler conferidas, atributos do perímetro preservados. Upload, HTTP/CORS e apresentação no mapa aguardam confirmação de caminho. CAR não configurado.
- **Retorno seguro:** remover apenas o pacote Micro e seus registros. Nenhuma dependência, template, configuração ativa ou publicação alterada.

## 2026-11-16 — Joy: conexão da Análise Micro

- **Autorização/estado:** responsável confirmou quatro arquivos em geojson/micro no R2. Conectados perímetro, curvas 2 m, curvas 3 m e drenagem, todos desligados; somente Bing permanece ligado. CAR aguarda envio. Câmera/Home, Macro e rasters preservados.
- **Fonte efetivamente publicada:** HTTP 200, CORS * e SHA-256 dos quatro arquivos correspondem aos originais, não às cópias preparadas. Mantidos como publicados: ignoreAltitude e uniqueFeatureIds reutilizam cópia de renderização existente, sem alterar coordenadas XY, fonte ou arquivos no R2. Datum vertical não informado; drapeamento não constitui transformação altimétrica.
- **Apresentação:** curvas pretas, grupo exclusivo 2 m/3 m; drenagem classificada por STRAHLER; perímetro amarelo sem preenchimento. Popups usam ELEVATION e DRAIN_AREA já com unidade, sem sufixo repetido; cota_m/comprimento_m opcionais para futuras versões preparadas. Identificadores cadastrais e ressalva de município da fonte preservados, sem correção silenciosa. Código municipal do perímetro segue divergente do contexto municipal macro.
- **Retorno seguro:** remover apenas ...microLayers da lista ativa. Sem transformação/publicação remota, dependências, commit ou alteração no template. Testes e limitações visuais relatados na entrega.

## 2026-11-16 — Joy: segundo mapa base Google Satellite com rótulos

- **Decisão/autorização:** responsável solicitou Google Maps 2D Satellite with Labels como segunda opção. Asset oficial 3830183 (referência https://sandcastle.cesium.com/?id=imagery-assets-available-from-ion), validado via endpoint ion HTTP 200 / IMAGERY / GOOGLE_2D_MAPS com token atual, sem divulgar credencial.
- **Implementação:** opção assetId no formato ion-world-imagery usa API pública IonImageryProvider.fromAssetId do Cesium instalado 1.147.0. Sem assetId, Bing e fallback permanecem como antes. Basemaps compartilham exclusiveGroup; Bing começa ligado e Google desligado. Fallback OSM existente preservado, mensagens identificam a fonte correta. Créditos nativos do provedor preservados; geocoder da aplicação já está desabilitado. Sem chave Google adicional ou URLs não oficiais.
- **Impacto:** somente Joy, sem alteração no template, dependências, câmera, rasters, vetores ou arquivos de ambiente. Mudança genérica poderá ser avaliada no template em tarefa separada.
- **Validação/retorno:** testes e verificações relatados na entrega. Para desativar a segunda opção, retirar googleBasemap da lista ativa; permanece Bing. Sem commit, push ou publicação.
- **Resultados:** check, typecheck e build aprovados. Teste de provedores atualizado com mock do ion, cobrindo assetId e fallback sem rede. Chromium headless confirmou Bing como padrão e exclusão mútua nos dois sentidos no desktop e seleção Google no viewport mobile. Endpoint real do asset respondeu 200 com token atual; desenho final dos tiles Google sobre o terreno não foi medido/inspecionado neste teste de controles.
