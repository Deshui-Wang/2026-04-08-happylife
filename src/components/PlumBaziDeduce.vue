<template>
  <div class="glass-card plum-card" style="display: flex; flex-direction: column; margin-bottom: 24px; padding: 24px;">
    <el-tabs v-model="activeDeduceTab" class="custom-tabs-container">
      <!-- 标签一：乾坤演兵起卦台 (梅花易数) -->
      <el-tab-pane name="plum">
        <template #label>
          <span class="tab-label-custom">
            <el-icon><Opportunity /></el-icon>
            <span>乾坤演兵起卦台</span>
          </span>
        </template>

        <div class="table-intro" style="margin: 15px 0 20px 0; font-size: 13px; color: #64748b; background: #f8fafc; padding: 10px 18px; border-radius: 10px; border-left: 3px solid #cbd5e1;">
          根据“数由心生、万物皆数”的法则，通过特定时间或数字输入来起卦，解算出本卦、互卦和变卦，研判体用生克。
        </div>

        <div class="plum-main-container" style="flex: 1; padding: 0; overflow-y: auto; margin-top: 0;">
          <el-row :gutter="24" class="deduce-main-row">
            <!-- 1. 起卦参数控制台 -->
            <el-col :xs="24" :md="9" class="plum-console-col">
              <div class="glass-card plum-console-card" style="height: 100%; margin-bottom: 0;">
                <div class="card-glow-title">
                  <el-icon class="glow-icon"><Opportunity /></el-icon>
                  <span>乾坤演兵起卦台</span>
                </div>
            
                <div class="console-mode-selector" style="margin-bottom: 20px; display: flex; justify-content: center;">
                  <el-radio-group v-model="plumParams.type" size="default" class="custom-radio-group">
                    <el-radio-button label="time">🕒 时间起卦</el-radio-button>
                    <el-radio-button label="number">🔢 数字起卦</el-radio-button>
                  </el-radio-group>
                </div>

                <!-- 时间起卦面板 -->
                <div v-if="plumParams.type === 'time'" class="console-form animate-fade-in" style="margin-bottom: 24px;">
                  <el-row :gutter="20">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" style="margin-bottom: 12px;">
                      <span class="input-label-mini" style="display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px;">农历年支 (年数)</span>
                      <el-select v-model="plumParams.lunarYear" placeholder="请选择年支" style="width: 100%;">
                        <el-option v-for="item in lunarYearOptions" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" style="margin-bottom: 12px;">
                      <span class="input-label-mini" style="display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px;">农历月份 (月数)</span>
                      <el-input-number v-model="plumParams.lunarMonth" :min="1" :max="12" style="width: 100%;" />
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" style="margin-bottom: 12px;">
                      <span class="input-label-mini" style="display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px;">农历日期 (日数)</span>
                      <el-input-number v-model="plumParams.lunarDay" :min="1" :max="30" style="width: 100%;" />
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" style="margin-bottom: 12px;">
                      <span class="input-label-mini" style="display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px;">农历时辰 (时数)</span>
                      <el-select v-model="plumParams.lunarHour" placeholder="请选择时辰" style="width: 100%;">
                        <el-option v-for="item in lunarHourOptions" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-col>
                  </el-row>
                  <div class="form-tips" style="font-size: 12px; color: #94a3b8; margin-top: 12px; line-height: 1.5; background: #fafafa; padding: 10px 14px; border-radius: 8px;">
                    * <strong>时间起卦公式：</strong>上卦 = (年支数 + 月数 + 日数) % 8；下卦 = (年支数 + 月数 + 日数 + 时支数) % 8；动爻 = (年支数 + 月数 + 日数 + 时支数) % 6。如果整除，卦余 0 视作 8（坤卦），爻余 0 视作 6（上爻）。
                  </div>
                </div>

                <!-- 数字起卦面板 -->
                <div v-else class="console-form animate-fade-in" style="margin-bottom: 24px;">
                  <el-row :gutter="20" style="align-items: flex-end;">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" style="margin-bottom: 12px;">
                      <span class="input-label-mini" style="display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px;">第一个数 (求上卦)</span>
                      <el-input-number v-model="plumParams.num1" :min="1" :max="9999999" style="width: 100%;" />
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" style="margin-bottom: 12px;">
                      <span class="input-label-mini" style="display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px;">第二个数 (求下卦)</span>
                      <el-input-number v-model="plumParams.num2" :min="1" :max="9999999" style="width: 100%;" />
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" style="margin-bottom: 12px;">
                      <span class="input-label-mini" style="display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px;">第三个数 (求动爻 · 可空)</span>
                      <el-input-number v-model="plumParams.num3" :min="1" :max="9999999" placeholder="不填则用两数之和求" style="width: 100%;" />
                    </el-col>
                  </el-row>
                  <div class="form-btn-row" style="margin-top: 10px; display: flex; justify-content: flex-end;">
                    <el-button type="success" size="default" :plain="true" class="magic-btn" @click="randomizePlumNums">
                      🎲 随机报数
                    </el-button>
                  </div>
                  <div class="form-tips" style="font-size: 12px; color: #94a3b8; margin-top: 12px; line-height: 1.5; background: #fafafa; padding: 10px 14px; border-radius: 8px;">
                    * <strong>数字起卦公式：</strong>第一个数除以 8 的余数为上卦；第二个数除以 8 的余数为下卦；第三个数（或两数之和）除以 6 的余数为动爻。
                  </div>
                </div>

                <div class="deduce-action-center">
                  <el-button type="primary" size="large" class="plum-deduce-big-btn" :loading="isDeducing" @click="calculatePlumBlossom" style="background: linear-gradient(135deg, #1e1b4b, #4c1d95); border: none; font-weight: bold; font-size: 16px; padding: 16px 40px; border-radius: 16px; box-shadow: 0 10px 20px rgba(76, 29, 149, 0.2); transition: all 0.3s;">
                    ☯ 开始太极推演起卦 ☯
                  </el-button>
                </div>
              </div>
            </el-col>

            <!-- 2. 全息演绎面板 -->
            <el-col :xs="24" :md="15">
              <div class="plum-display-section">
                <!-- 空状态 -->
                <div v-if="deducingStep === 0" class="glass-card plum-empty-card animate-fade-in" style="text-align: center; padding: 60px 40px; background: rgba(255,255,255,0.6) !important; border-radius: 24px; border: 1px dashed rgba(99,102,241,0.25);">
                  <div class="empty-taiji-spinner" style="font-size: 64px; color: #cbd5e1; margin-bottom: 20px; animation: spinTaiji 15s linear infinite; display: inline-block;">☯</div>
                  <h3 style="font-size: 20px; font-weight: 800; color: #475569; margin: 0 0 10px 0;">天道无常 · 乾坤有数</h3>
                  <p style="font-size: 14px; color: #94a3b8; max-width: 500px; margin: 0 auto; line-height: 1.6;">请在上方配置您的起卦参数，并点击“开始太极推演起卦”按钮，系统将实时计算并在此生成全息三卦排盘及体用生克吉凶分析。</p>
                </div>

                <!-- 推演中动效 -->
                <div v-else-if="deducingStep === 1" class="glass-card plum-loading-card" style="text-align: center; padding: 60px 40px; border-radius: 24px;">
                  <div class="taiji-loading-icon spinning-fast" style="font-size: 64px; color: #6366f1; margin-bottom: 20px; animation: spinTaiji 2s linear infinite; display: inline-block;">☯</div>
                  <h3 style="font-size: 18px; font-weight: 800; color: #1e293b; margin: 0 0 20px 0;">正在排布三卦，洞悉天机...</h3>
                  <div class="loading-bar" style="width: 240px; height: 6px; background: #e2e8f0; border-radius: 3px; margin: 0 auto; overflow: hidden;">
                    <div class="loading-progress" style="width: 100%; height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); animation: loadProgress 1s ease-in-out infinite; transform-origin: left;"></div>
                  </div>
                </div>

                <!-- 推演完成：全息排盘展示 -->
                <div v-else class="plum-result-board animate-fade-in">
                  <!-- 卦画三列排盘 -->
                  <el-row :gutter="24" class="hexagrams-row" style="margin-bottom: 24px;">
                    <!-- 本卦 -->
                    <el-col :xs="24" :md="8" style="margin-bottom: 20px;">
                      <div class="glass-card hexagram-card ben-card">
                        <div class="hex-badge" style="background: rgba(99, 102, 241, 0.1); color: #4f46e5; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px;">本卦 · 现状与初始</div>
                        <div class="hex-lines-container">
                          <div v-for="index in [5, 4, 3, 2, 1, 0]" :key="'ben-yao-' + index" class="hex-yao-line" :style="{ position: 'relative', width: '100%', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                            <div v-if="plumResult.ben.yao[index] === 1" class="yao-bar yang-bar" :style="{ width: '100%', height: '8px', background: (index + 1) === plumResult.movingYao ? 'linear-gradient(90deg, #d97706, #fbbf24)' : '#334155', borderRadius: '4px', boxShadow: (index + 1) === plumResult.movingYao ? '0 0 10px rgba(251, 191, 36, 0.6)' : 'none' }"></div>
                            <div v-else class="yao-bar yin-bar" :style="{ width: '100%', height: '8px', display: 'flex', justifyContent: 'space-between' }">
                              <div class="yin-half left-half" :style="{ width: '45%', height: '100%', background: (index + 1) === plumResult.movingYao ? 'linear-gradient(90deg, #d97706, #fbbf24)' : '#334155', borderRadius: '4px', boxShadow: (index + 1) === plumResult.movingYao ? '0 0 10px rgba(251, 191, 36, 0.6)' : 'none' }"></div>
                              <div class="yin-half right-half" :style="{ width: '45%', height: '100%', background: (index + 1) === plumResult.movingYao ? 'linear-gradient(90deg, #fbbf24, #d97706)' : '#334155', borderRadius: '4px', boxShadow: (index + 1) === plumResult.movingYao ? '0 0 10px rgba(251, 191, 36, 0.6)' : 'none' }"></div>
                            </div>
                            <span class="yao-label-tag">{{ getClerkYaoName(index + 1) }}</span>
                            <span v-if="(index + 1) === plumResult.movingYao" class="moving-dot">○ 动爻</span>
                          </div>
                        </div>
                        <div class="hex-gua-meta" style="text-align: center; width: 100%; margin-top: 10px;">
                          <h2 style="font-size: 22px; font-weight: 800; color: #1e293b; margin: 0 0 8px 0;">{{ plumResult.ben.name }}</h2>
                          <div class="hex-tag-row" style="display: flex; gap: 8px; justify-content: center; margin-bottom: 12px;">
                            <el-tag size="small" type="warning" effect="dark" style="border: none;">{{ plumResult.ben.upGua.name }}天 / {{ plumResult.ben.downGua.name }}地</el-tag>
                            <el-tag size="small" type="danger" effect="plain" style="border-radius: 6px; font-weight: bold;">{{ plumResult.isTiUp ? '上体下用' : '下体上用' }}</el-tag>
                          </div>
                          <p class="hex-desc" style="font-size: 12px; color: #64748b; line-height: 1.5; background: #f8fafc; padding: 10px; border-radius: 10px; min-height: 54px; margin: 0;">{{ plumResult.ben.desc }}</p>
                        </div>
                      </div>
                    </el-col>

                    <!-- 互卦 -->
                    <el-col :xs="24" :md="8" style="margin-bottom: 20px;">
                      <div class="glass-card hexagram-card hu-card">
                        <div class="hex-badge" style="background: rgba(148, 163, 184, 0.1); color: #475569; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px;">互卦 · 核心与中途</div>
                        <div class="hex-lines-container">
                          <div v-for="index in [5, 4, 3, 2, 1, 0]" :key="'hu-yao-' + index" class="hex-yao-line" :style="{ position: 'relative', width: '100%', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                            <div v-if="plumResult.hu.yao[index] === 1" class="yao-bar yang-bar" style="width: 100%; height: 8px; background: #475569; border-radius: 4px;"></div>
                            <div v-else class="yao-bar yin-bar" style="width: 100%; height: 8px; display: flex; justify-content: space-between;">
                              <div class="yin-half left-half" style="width: 45%; height: 100%; background: #475569; border-radius: 4px;"></div>
                              <div class="yin-half right-half" style="width: 45%; height: 100%; background: #475569; border-radius: 4px;"></div>
                            </div>
                            <span class="yao-label-tag">{{ getClerkYaoName(index + 1) }}</span>
                          </div>
                        </div>
                        <div class="hex-gua-meta" style="text-align: center; width: 100%; margin-top: 10px;">
                          <h2 style="font-size: 22px; font-weight: 800; color: #1e293b; margin: 0 0 8px 0;">{{ plumResult.hu.name }}</h2>
                          <div class="hex-tag-row" style="display: flex; gap: 8px; justify-content: center; margin-bottom: 12px;">
                            <el-tag size="small" type="info" effect="dark" style="border: none;">{{ plumResult.hu.upGua.name }}天 / {{ plumResult.hu.downGua.name }}地</el-tag>
                          </div>
                          <p class="hex-desc" style="font-size: 12px; color: #64748b; line-height: 1.5; background: #f8fafc; padding: 10px; border-radius: 10px; min-height: 54px; margin: 0;">{{ plumResult.hu.desc }}</p>
                        </div>
                      </div>
                    </el-col>

                    <!-- 变卦 -->
                    <el-col :xs="24" :md="8" style="margin-bottom: 20px;">
                      <div class="glass-card hexagram-card bian-card">
                        <div class="hex-badge" style="background: rgba(16, 185, 129, 0.1); color: #059669; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px;">变卦 · 结果与终局</div>
                        <div class="hex-lines-container">
                          <div v-for="index in [5, 4, 3, 2, 1, 0]" :key="'bian-yao-' + index" class="hex-yao-line" :style="{ position: 'relative', width: '100%', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                            <div v-if="plumResult.bian.yao[index] === 1" class="yao-bar yang-bar" :style="{ width: '100%', height: '8px', background: (index + 1) === plumResult.movingYao ? 'linear-gradient(90deg, #10b981, #34d399)' : '#334155', borderRadius: '4px', boxShadow: (index + 1) === plumResult.movingYao ? '0 0 10px rgba(16, 185, 129, 0.6)' : 'none' }"></div>
                            <div v-else class="yao-bar yin-bar" :style="{ width: '100%', height: '8px', display: 'flex', justifyContent: 'space-between' }">
                              <div class="yin-half left-half" :style="{ width: '45%', height: '100%', background: (index + 1) === plumResult.movingYao ? 'linear-gradient(90deg, #10b981, #34d399)' : '#334155', borderRadius: '4px', boxShadow: (index + 1) === plumResult.movingYao ? '0 0 10px rgba(16, 185, 129, 0.6)' : 'none' }"></div>
                              <div class="yin-half right-half" :style="{ width: '45%', height: '100%', background: (index + 1) === plumResult.movingYao ? 'linear-gradient(90deg, #34d399, #10b981)' : '#334155', borderRadius: '4px', boxShadow: (index + 1) === plumResult.movingYao ? '0 0 10px rgba(16, 185, 129, 0.6)' : 'none' }"></div>
                            </div>
                            <span class="yao-label-tag">{{ getClerkYaoName(index + 1) }}</span>
                            <span v-if="(index + 1) === plumResult.movingYao" class="change-dot">● 变爻</span>
                          </div>
                        </div>
                        <div class="hex-gua-meta" style="text-align: center; width: 100%; margin-top: 10px;">
                          <h2 style="font-size: 22px; font-weight: 800; color: #1e293b; margin: 0 0 8px 0;">{{ plumResult.bian.name }}</h2>
                          <div class="hex-tag-row" style="display: flex; gap: 8px; justify-content: center; margin-bottom: 12px;">
                            <el-tag size="small" type="success" effect="dark" style="border: none;">{{ plumResult.bian.upGua.name }}天 / {{ plumResult.bian.downGua.name }}地</el-tag>
                          </div>
                          <p class="hex-desc" style="font-size: 12px; color: #64748b; line-height: 1.5; background: #f8fafc; padding: 10px; border-radius: 10px; min-height: 54px; margin: 0;">{{ plumResult.bian.desc }}</p>
                        </div>
                      </div>
                    </el-col>
                  </el-row>

                  <!-- 体用生克与谶语解析面板 -->
                  <div class="glass-card plum-analysis-card" style="border-radius: 24px; padding: 24px; background: rgba(255,255,255,0.85) !important;">
                    <div class="card-glow-title" style="border-bottom: 1px dashed #e2e8f0; padding-bottom: 15px; margin-bottom: 24px;">
                      <el-icon class="glow-icon"><Opportunity /></el-icon>
                      <span>梅花体用相法全息解析</span>
                    </div>
                    <div class="analysis-inner-grid">
                      <div class="relation-board-box" style="background: #f8fafc; border-radius: 20px; padding: 24px; border: 1px solid rgba(0,0,0,0.02); display: flex; justify-content: space-around; align-items: center; position: relative;">
                        <div class="relation-actor ti-actor" style="display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 1;">
                          <span class="actor-tag" style="font-size: 11px; font-weight: 800; color: #4f46e5; background: rgba(99,102,241,0.1); padding: 2px 8px; border-radius: 10px;">体卦 (主)</span>
                          <div class="actor-circle-glow" :style="{ border: '3px solid ' + plumResult.tiGua.color }">
                            <span class="actor-symbol" :style="{ color: plumResult.tiGua.color }">{{ plumResult.tiGua.symbol }}</span>
                            <h4 class="actor-name">{{ plumResult.tiGua.name }}卦</h4>
                          </div>
                          <el-tag effect="dark" size="small" :color="plumResult.tiGua.color" style="border:none; font-weight: 800;">{{ plumResult.tiGua.element }} ({{ plumResult.tiGua.nature }})</el-tag>
                        </div>
                        <div class="relation-link-arrow">
                          <div class="arrow-relation-badge" style="background: linear-gradient(135deg, #1e1b4b, #311042); color: #fbbf24; font-weight: 900; padding: 4px 10px; border-radius: 10px; text-shadow: 0 1px 2px rgba(0,0,0,0.2); box-shadow: 0 4px 10px rgba(0,0,0,0.15); z-index: 2; white-space: nowrap;">{{ plumResult.relation }}</div>
                          <div class="arrow-visual-line" style="width: 100%; height: 2px; border-bottom: 2px dashed #cbd5e1; position: absolute; top: 12px; left: 0;"></div>
                          <div class="arrow-direction-marker" style="position: absolute; top: 8px; font-size: 12px; color: #94a3b8;" :style="plumResult.relation === '用生体' ? { left: '15px' } : plumResult.relation === '体生用' || plumResult.relation === '体克用' ? { right: '15px' } : { display: 'none' }">{{ plumResult.relation === '用生体' ? '◀' : '▶' }}</div>
                        </div>
                        <div class="relation-actor yong-actor" style="display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 1;">
                          <span class="actor-tag" style="font-size: 11px; font-weight: 800; color: #b45309; background: rgba(245,158,11,0.1); padding: 2px 8px; border-radius: 10px;">用卦 (事/客)</span>
                          <div class="actor-circle-glow" :style="{ border: '3px solid ' + plumResult.yongGua.color }">
                            <span class="actor-symbol" :style="{ color: plumResult.yongGua.color }">{{ plumResult.yongGua.symbol }}</span>
                            <h4 class="actor-name">{{ plumResult.yongGua.name }}卦</h4>
                          </div>
                          <el-tag effect="dark" size="small" :color="plumResult.yongGua.color" style="border:none; font-weight: 800;">{{ plumResult.yongGua.element }} ({{ plumResult.yongGua.nature }})</el-tag>
                        </div>
                      </div>
                      <div class="relation-luck-box" :class="getLuckClass(plumResult.luckLevel)" style="border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 14px; justify-content: center; transition: all 0.3s;" :style="{ borderLeft: '6px solid ' + (plumResult.luckLevel.includes('大吉') ? '#f59e0b' : plumResult.luckLevel.includes('吉') ? '#10b981' : plumResult.luckLevel.includes('大凶') ? '#ef4444' : plumResult.luckLevel.includes('凶') ? '#f43f5e' : '#64748b'), background: plumResult.luckLevel.includes('大吉') ? '#fffdf5' : plumResult.luckLevel.includes('大凶') ? '#fff5f5' : '#f8fafc' }">
                        <div class="luck-grade-row" style="display: flex; align-items: center; gap: 10px;">
                          <span style="font-size: 13px; font-weight: 800; color: #64748b;">测算吉凶判定：</span>
                          <div class="luck-grade-badge" style="font-size: 16px; font-weight: 900; color: white; padding: 4px 14px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.06);" :style="{ background: plumResult.luckLevel.includes('大吉') ? 'linear-gradient(135deg, #fbbf24, #d97706)' : plumResult.luckLevel.includes('吉') ? 'linear-gradient(135deg, #34d399, #059669)' : plumResult.luckLevel.includes('大凶') ? 'linear-gradient(135deg, #f43f5e, #be123c)' : plumResult.luckLevel.includes('凶') ? 'linear-gradient(135deg, #fda4af, #e11d48)' : 'linear-gradient(135deg, #cbd5e1, #475569)' }">{{ plumResult.luckLevel }}</div>
                        </div>
                        <div class="luck-detail-content" style="display: flex; flex-direction: column; gap: 10px;">
                          <p class="relation-desc-text" style="font-size: 13px; line-height: 1.5; color: #475569; margin: 0;"><strong>卦气气场：</strong>{{ plumResult.relationDesc }}</p>
                          <div class="rhyme-box text-left" style="background: rgba(255, 255, 255, 0.75); border-radius: 12px; padding: 12px; display: flex; align-items: flex-start; gap: 6px; border-left: 4px solid #fbbf24; margin: 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.01);">
                            <span class="quote-mark" style="font-size: 24px; font-weight: bold; color: #cbd5e1; font-family: Georgia, serif; line-height: 1; margin-top: -5px;">"</span>
                            <span class="rhyme-text bold-text" style="font-size: 13.5px; color: #334155; font-weight: 800; line-height: 1.6; text-align: justify;">{{ plumResult.luckDesc }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- 标签二：生辰八字 -->
      <el-tab-pane name="bazi">
        <template #label>
          <span class="tab-label-custom">
            <el-icon><Notebook /></el-icon>
            <span>生辰八字</span>
          </span>
        </template>

        <div class="table-intro" style="margin: 15px 0 20px 0; font-size: 13px; color: #64748b; background: #f8fafc; padding: 10px 18px; border-radius: 10px; border-left: 3px solid #cbd5e1;">
          录入公历阳历的出生年、月、日、时数字，系统将基于高精度干支历法自动换算并推排其天干地支四柱命盘。
        </div>

        <div class="bazi-main-container" style="margin-top: 20px;">
          <el-row :gutter="24" class="deduce-main-row">
            <el-col :xs="24" :md="8" style="margin-bottom: 20px;">
              <div class="glass-card bazi-input-card">
                <div>
                  <h3 style="font-size: 15px; font-weight: 800; color: #1e293b; margin: 0 0 15px 0; display: flex; align-items: center; gap: 6px;">
                    <span style="color: #6366f1;">☯</span> 输入公历生日数字
                  </h3>
                  <el-row :gutter="12">
                    <el-col :span="12" style="margin-bottom: 12px;">
                      <span class="input-label-mini" style="display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px;">出生年份 (公历)</span>
                      <el-input-number v-model="baziParams.solarYear" :min="1900" :max="2100" style="width: 100%;" :controls="false" placeholder="如 1995" />
                    </el-col>
                    <el-col :span="12" style="margin-bottom: 12px;">
                      <span class="input-label-mini" style="display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px;">出生月份 (公历)</span>
                      <el-input-number v-model="baziParams.solarMonth" :min="1" :max="12" style="width: 100%;" placeholder="1-12" />
                    </el-col>
                    <el-col :span="12" style="margin-bottom: 12px;">
                      <span class="input-label-mini" style="display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px;">出生日期 (公历)</span>
                      <el-input-number v-model="baziParams.solarDay" :min="1" :max="31" style="width: 100%;" placeholder="1-31" />
                    </el-col>
                    <el-col :span="12" style="margin-bottom: 12px;">
                      <span class="input-label-mini" style="display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px;">出生小时 (0-23)</span>
                      <el-input-number v-model="baziParams.solarHour" :min="0" :max="23" style="width: 100%;" placeholder="0-23" />
                    </el-col>
                  </el-row>
                  <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 10px;">
                    * 录入公历阳历的出生年、月、日、时数字，系统将基于高精度干支历法自动换算并推排其天干地支四柱命盘。
                  </p>
                </div>
                <div style="margin-top: 20px;">
                  <el-button type="primary" size="large" style="width: 100%; background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; font-weight: 800; border-radius: 12px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);" :loading="baziDeducing" @click="calculateBaziDestiny">
                    ☯ 开启八字全息推算 ☯
                  </el-button>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :md="16">
              <div v-if="baziDeducingStep === 0" class="glass-card bazi-placeholder">
                <div style="font-size: 48px; color: #cbd5e1; margin-bottom: 12px; animation: spinTaiji 15s linear infinite; display: inline-block;">☯</div>
                <h4 style="font-size: 16px; font-weight: 800; color: #475569; margin: 0 0 6px 0;">命由天定 · 运由己造</h4>
                <p style="font-size: 12.5px; color: #94a3b8; max-width: 420px; line-height: 1.6; margin: 0;">请输入您的阳历生日信息并点击“开启八字全息推算”，我们将在此生成您的乾坤四柱排盘、五行能量配比以及详尽的日主命理解析。</p>
              </div>
              <div v-else-if="baziDeducingStep === 1" class="glass-card bazi-loading">
                <div style="font-size: 48px; color: #6366f1; margin-bottom: 12px; animation: spinTaiji 2s linear infinite; display: inline-block;">☯</div>
                <h4 style="font-size: 15px; font-weight: 800; color: #1e293b; margin: 0 0 10px 0;">排定乾坤四柱，推衍命理玄机...</h4>
                <div style="width: 180px; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; margin: 0 auto;">
                  <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); animation: loadProgress 1s ease-in-out infinite; transform-origin: left;"></div>
                </div>
              </div>
              <div v-else class="animate-fade-in" style="display: flex; flex-direction: column; gap: 16px;">
                <div style="background: rgba(255,255,255,0.7); border-radius: 16px; padding: 16px; border: 1px solid rgba(0,0,0,0.02);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                    <span style="font-size: 13px; font-weight: 800; color: #1e293b;">📅 生日信息：{{ baziResult.solarDate }} ({{ baziResult.lunarDate }})</span>
                    <el-tag size="small" type="success" effect="dark" style="border: none; font-weight: 800;">八字命盘：{{ baziResult.eightCharStr }}</el-tag>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                    <div v-for="col in baziResult.columns" :key="col.name" style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 10px 6px; text-align: center; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.01);">
                      <div style="font-size: 11px; color: #94a3b8; font-weight: bold;">{{ col.name }}</div>
                      <div><el-tag size="small" :type="col.tenGod === '日元' ? 'danger' : 'info'" effect="plain" style="font-size: 9px; padding: 0 4px; font-weight: bold; border-radius: 4px;">{{ col.tenGod }}</el-tag></div>
                      <div style="font-size: 24px; font-weight: 900; line-height: 1.2; display: flex; justify-content: center; gap: 4px;">
                        <span :style="{ color: col.ganElement?.color }">{{ col.gan }}</span>
                        <span :style="{ color: col.zhiElement?.color }">{{ col.zhi }}</span>
                      </div>
                      <div style="font-size: 9px; color: #64748b; line-height: 1.3;">
                        <span style="color: #94a3b8; display: block; font-size: 8px; margin-bottom: 2px;">地支藏干</span>
                        <span v-for="cg in col.hideGan" :key="cg" style="margin: 0 2px;">{{ cg }}</span>
                      </div>
                      <div style="font-size: 9px; color: #475569; background: #f1f5f9; padding: 2px 4px; border-radius: 6px; font-weight: 700; margin-top: auto;">{{ col.nayin }}</div>
                    </div>
                  </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                  <div style="background: rgba(255,255,255,0.7); border-radius: 16px; padding: 16px; border: 1px solid rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                      <h4 style="font-size: 13.5px; font-weight: 800; color: #1e293b; margin: 0 0 12px 0;">📊 八字五行能量配比</h4>
                      <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div v-for="elItem in fiveElements" :key="elItem.name" style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 11px; width: 52px; font-weight: bold;" :style="{ color: elItem.color }">{{ elItem.label }}</span>
                          <el-progress :percentage="baziResult.elementRates[elItem.name]" :color="elItem.color" style="flex: 1;" :stroke-width="8" />
                          <span style="font-size: 11px; font-weight: bold; color: #475569; width: 75px; text-align: right;">{{ baziResult.elementCounts[elItem.name] }}字 ({{ baziResult.elementRates[elItem.name] }}%)</span>
                        </div>
                      </div>
                    </div>
                    <div style="margin-top: 12px; background: #f8fafc; padding: 8px 12px; border-radius: 8px; font-size: 11.5px; line-height: 1.4; color: #64748b;">
                      * <strong>局势分析：</strong>此造中五行最盛为【<strong :style="{ color: getElementColor(baziResult.maxEl) }">{{ baziResult.maxEl }}</strong>】(占比{{ baziResult.elementRates[baziResult.maxEl] }}%)，较薄弱为【<strong>{{ baziResult.minEl }}</strong>】。建议日常运势调和以【{{ baziResult.minEl }}】属性为主。
                    </div>
                  </div>
                  <div style="background: rgba(255,255,255,0.7); border-radius: 16px; padding: 16px; border: 1px solid rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
                    <div>
                      <h4 style="font-size: 13.5px; font-weight: 800; color: #1e293b; margin: 0 0 10px 0; display: flex; align-items: center; gap: 6px;">
                        <span>☯</span> {{ baziResult.advice.title }}
                      </h4>
                      <p style="font-size: 12px; line-height: 1.5; color: #475569; margin: 0 0 8px 0;"><strong>性格特质：</strong>{{ baziResult.advice.character }}</p>
                      <p style="font-size: 12px; line-height: 1.5; color: #475569; margin: 0 0 8px 0;"><strong>先天命格：</strong>{{ baziResult.advice.destiny }}</p>
                      <p style="font-size: 12px; line-height: 1.5; color: #b45309; margin: 0;"><strong>开运建议：</strong>{{ baziResult.advice.advice }}</p>
                    </div>
                    <div style="background: linear-gradient(135deg, #fffbeb, #fef3c7); border-radius: 10px; padding: 10px; border-left: 4px solid #f59e0b; margin: 0;">
                      <div style="font-size: 12px; font-weight: bold; color: #b45309; margin-bottom: 2px;">开运太极谶：</div>
                      <div style="font-size: 12px; font-weight: 800; color: #78350f; font-family: monospace; line-height: 1.4;">"{{ baziResult.advice.poem }}"</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- 标签三：梅花寻物 -->
      <el-tab-pane name="find">
        <template #label>
          <span class="tab-label-custom">
            <el-icon><MagicStick /></el-icon>
            <span>梅花寻物</span>
          </span>
        </template>

        <div class="table-intro" style="margin: 15px 0 20px 0; font-size: 13px; color: #64748b; background: #f8fafc; padding: 10px 18px; border-radius: 10px; border-left: 3px solid #cbd5e1;">
          根据“心诚则灵、数显其位”的法理，依据您输入的文字字数配合求卦时刻，指点遗失物品的方位与寻觅建议。
        </div>

        <div class="tab-content-wrapper" style="margin-top: 20px;">
          <el-row :gutter="25" class="deduce-main-row">
            <!-- 左侧：输入起卦表单 -->
            <el-col :xs="24" :md="10" style="margin-bottom: 20px;">
              <div class="glass-card form-card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <div class="card-glow-title">
                  <el-icon class="glow-icon"><MagicStick /></el-icon>
                  <span>梅花易数 · 失物起卦</span>
                </div>

                <el-form :model="form" label-position="top" @submit.prevent="startDivining">
                  <el-form-item label="我丢了什么？" required>
                    <el-input 
                      v-model="form.itemName" 
                      placeholder="直接说，比如：我的钥匙不见了" 
                      :prefix-icon="Search"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item label="大概什么时候丢的？" required>
                    <el-input 
                      v-model="form.lostTime" 
                      placeholder="随便说，比如：今天上午、昨天晚上" 
                      :prefix-icon="Calendar"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item label="最后在哪见过？" required>
                    <el-input 
                      v-model="form.lastLocation" 
                      placeholder="大概位置就行，比如：家里、办公室" 
                      :prefix-icon="MapLocation"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item label="选择你想要的回复风格">
                    <el-select v-model="form.personality" style="width: 100%">
                      <el-option value="boyfriend" label="💕 男友鼓励式（温柔体贴）" />
                      <el-option value="mom" label="👩‍👧‍👦 妈妈批评式（恨铁不成钢）" />
                      <el-option value="bestie" label="👯‍♀️ 闺蜜吐槽式（毒舌但关心）" />
                      <el-option value="master" label="🧙‍♂️ 大师指点式（高深莫测）" />
                      <el-option value="cute" label="🐱 萌宠陪伴式（软萌可爱）" />
                    </el-select>
                  </el-form-item>

                  <div style="margin-top: 20px;">
                    <el-button 
                      type="primary" 
                      class="w-full submit-btn" 
                      :loading="loading"
                      @click="startDivining"
                    >
                      🔮 帮我起卦找找吧！
                    </el-button>
                  </div>
                </el-form>

                <div class="tips-panel" style="margin-top: 20px;">
                  <div class="tips-title"><el-icon><InfoFilled /></el-icon> 💡 起卦说明</div>
                  <ul>
                    <li>心诚则灵，口语化描述丢失物品及情境即可，无需刻意修饰。</li>
                    <li>排卦将依据您输入的文字长度结合当前时辰，演算本卦与动爻方位。</li>
                    <li>选择您喜欢的回复语气，以轻松愉悦的心态面对寻物过程。</li>
                  </ul>
                </div>
              </div>
            </el-col>

            <!-- 右侧：演算与解卦结果 -->
            <el-col :xs="24" :md="14" style="margin-bottom: 20px;">
              <!-- 待起卦状态 -->
              <div v-if="!loading && !resultVisible" class="glass-card empty-card text-center" style="height: 100%; box-sizing: border-box;">
                <div class="crystal-ball-wrapper">
                  <div class="crystal-ball">
                    <div class="yin-yang-mark">☯</div>
                    <div class="glow-effect"></div>
                  </div>
                </div>
                <h3 class="status-title">卦盘待启</h3>
                <p class="status-desc">
                  请在左侧输入您要寻找的物品、时间以及最后出现的方位，<br>
                  选好语气风格后点击起卦。我将为您拨开迷雾，开启寻物卦盘。
                </p>
              </div>

              <!-- 排卦加载中 -->
              <div v-if="loading" class="glass-card loading-card text-center" style="height: 100%; box-sizing: border-box;">
                <div class="bagua-loader">
                  <div class="bagua-outer">
                    <span class="trigram">☰</span>
                    <span class="trigram">☱</span>
                    <span class="trigram">☲</span>
                    <span class="trigram">☳</span>
                    <span class="trigram">☴</span>
                    <span class="trigram">☵</span>
                    <span class="trigram">☶</span>
                    <span class="trigram">☷</span>
                  </div>
                  <div class="bagua-inner">☯</div>
                </div>
                <h3 class="status-title scanning">正在演算乾坤爻象...</h3>
                <p class="status-desc">正在收集时序气息，基于梅花易数原理进行数字推演...</p>
              </div>

              <!-- 解卦结果 -->
              <div v-if="!loading && resultVisible && resultData" class="result-area animate-fade-in" style="display: flex; flex-direction: column; gap: 20px;">
                <!-- 1. 角色语气条 -->
                <div class="greeting-banner">
                  <div class="avatar-box">{{ personalities[form.personality].avatar }}</div>
                  <div class="greeting-text">
                    <h4>{{ personalities[form.personality].name }}：</h4>
                    <p>“{{ resultData.greeting }}！”</p>
                  </div>
                </div>

                <!-- 2. 卦象主卡片 -->
                <div class="glass-card hexagram-card">
                  <div class="hexagram-main">
                    <div class="hexagram-symbol-box">
                      <span class="symbol">{{ resultData.hexagram.symbol }}</span>
                      <span class="symbol-name">{{ resultData.hexagram.name }}卦</span>
                    </div>
                    <div class="hexagram-meta">
                      <h3 class="meta-title">{{ resultData.hexagram.name }}（{{ resultData.hexagram.meaning }}）卦象显现</h3>
                      <div class="badge-row">
                        <el-tag type="primary" effect="dark" class="rounded-tag">
                          📍 寻物方向：{{ resultData.hexagram.direction }}方位
                        </el-tag>
                        <el-tag type="warning" effect="dark" class="rounded-tag">
                          🔍 建议位置：{{ resultData.hexagram.location }}
                        </el-tag>
                      </div>
                    </div>
                  </div>

                  <div class="hexagram-details">
                    <div class="detail-item">
                      <h5>📍 详细卦象分析</h5>
                      <p>{{ resultData.hexagram.detailed }}</p>
                    </div>
                    <div class="detail-item">
                      <h5>⏰ 寻物时机建议</h5>
                      <p>{{ resultData.hexagram.timeAdvice }}</p>
                    </div>
                    <div class="detail-item">
                      <h5>💡 乾坤运势提示</h5>
                      <p>{{ resultData.hexagram.tips }}</p>
                    </div>
                  </div>

                  <!-- 情境专属指引 -->
                  <div class="situational-advice" style="margin-top: 20px;">
                    <div class="bubble-triangle"></div>
                    <p class="advice-content">✨ <strong>指引建议：</strong>{{ resultData.advice }}</p>
                    <p class="encouragement-content">❤️ {{ resultData.encouragement }}</p>
                  </div>
                </div>

                <!-- 3. 梅花易数数学推演折叠面板 -->
                <el-collapse class="glass-collapse">
                  <el-collapse-item name="calculations">
                    <template #title>
                      <div class="collapse-header">
                        <el-icon><InfoFilled /></el-icon>
                        <span>查看梅花易数数学推演过程</span>
                      </div>
                    </template>
                    <div class="calculation-process">
                      <div class="step-item">
                        <h6>1️⃣ 起卦信息收集</h6>
                        <div class="step-content">
                          <p>• 物品信息：<strong>{{ resultData.calculations.item }}</strong> (字数：{{ resultData.calculations.itemNum }})</p>
                          <p>• 时间信息：<strong>{{ resultData.calculations.time }}</strong> (字数：{{ resultData.calculations.timeNum }})</p>
                          <p>• 地点信息：<strong>{{ resultData.calculations.location }}</strong> (字数：{{ resultData.calculations.locationNum }})</p>
                          <p>• 起卦时分：<strong>{{ resultData.calculations.hour }}时{{ resultData.calculations.minute }}分</strong></p>
                        </div>
                      </div>

                      <div class="step-item">
                        <h6>2️⃣ 先天数理演算</h6>
                        <div class="step-content code-font">
                          <p>• 上卦数 (天卦)：(物品字数 {{ resultData.calculations.itemNum }} + 时间字数 {{ resultData.calculations.timeNum }}) ÷ 8 = {{ resultData.calculations.upperDiv }} 余 <strong>{{ resultData.calculations.upperRemainder }}</strong></p>
                          <p>• 下卦数 (地卦)：(地点字数 {{ resultData.calculations.locationNum }} + 分钟数 {{ resultData.calculations.minute }}) ÷ 8 = {{ resultData.calculations.lowerDiv }} 余 <strong>{{ resultData.calculations.lowerRemainder }}</strong></p>
                          <p>• 爻动数 (变卦)：(总字数 {{ resultData.calculations.itemNum + resultData.calculations.timeNum + resultData.calculations.locationNum }} + 分钟数 {{ resultData.calculations.minute }}) ÷ 6 = {{ resultData.calculations.movingDiv }} 余 <strong>{{ resultData.calculations.movingRemainder }}</strong></p>
                        </div>
                      </div>

                      <div class="step-item">
                        <h6>3️⃣ 本卦卦象定位</h6>
                        <div class="step-content">
                          <p>• 依据梅花易数：上卦余数 <strong>{{ resultData.calculations.upperRemainder }}</strong> 与下卦余数 <strong>{{ resultData.calculations.lowerRemainder }}</strong> 对应本卦为：<strong>{{ resultData.calculations.name }}卦 {{ resultData.calculations.symbol }}</strong>。</p>
                          <p>• 卦义为：<strong>{{ resultData.calculations.meaning }}</strong>，代表 {{ resultData.calculations.detailed.substring(resultData.calculations.detailed.indexOf('象征') + 2, resultData.calculations.detailed.indexOf('。')) }}。</p>
                        </div>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>

                <!-- 5. 底部操作按钮 -->
                <div class="action-buttons">
                  <el-button type="success" :icon="Share" class="action-btn" @click="shareResult">
                    分享本次起卦
                  </el-button>
                  <el-button type="warning" :icon="Refresh" class="action-btn" @click="resetForm">
                    重新寻找失物
                  </el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- 标签四：梅花射覆 -->
      <el-tab-pane name="guess">
        <template #label>
          <span class="tab-label-custom">
            <el-icon><Compass /></el-icon>
            <span>梅花射覆</span>
          </span>
        </template>

        <div class="table-intro" style="margin: 15px 0 20px 0; font-size: 13px; color: #64748b; background: #f8fafc; padding: 10px 18px; border-radius: 10px; border-left: 3px solid #cbd5e1;">
          射覆是古代文人利用先天卦象猜测覆盖物下所藏物件的哲理游戏。默想身边一物并写下天、地、人三才感应数，以测天机。
        </div>

        <div class="tab-content-wrapper" style="margin-top: 20px;">
          <!-- 梅花射覆卡片 -->
          <div class="glass-card secret-card" style="margin-bottom: 24px; padding: 24px;">
            <div class="card-glow-title justify-between" style="display: flex; justify-content: space-between; align-items: center; width: 100%; border-bottom: 1px dashed rgba(226,232,240,0.8); padding-bottom: 15px;">
              <div style="display:flex;align-items:center;gap:8px">
                <el-icon class="glow-icon"><Compass /></el-icon>
                <span>梅花射覆（数理战绩）</span>
              </div>
              <div class="score-board">
                <span>🔮 已射: <strong class="score-num">{{ shefuStats.total }}</strong> 次</span>
                <el-divider direction="vertical" />
                <span>🎯 中: <strong class="score-num text-success">{{ shefuStats.hits }}</strong> 次</span>
                <el-divider direction="vertical" />
                <span>📈 准确率: <strong class="score-num text-primary">{{ shefuStats.rate }}%</strong></span>
              </div>
            </div>

            <el-row :gutter="25" class="guess-tab-row">
              <!-- 射覆输入表单 -->
              <el-col :xs="24" :md="10" style="margin-bottom: 20px;">
                <div class="glass-card shefu-form-card" style="padding: 24px;">
                  <div class="secret-intro" style="margin-top: 0;">
                    <h4 style="margin-top: 0;">什么是“射覆”？</h4>
                    <p>射覆是古代利用数理占卜猜测覆盖物下所藏之物的一种高级文字与哲学游戏。请在脑海中默想身边某件物品，并随机或凭直觉写下三个感应数，看看卦象能否识破天机。</p>
                  </div>

                  <el-form :model="shefuForm" label-position="top" style="margin-top: 15px;">
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-form-item label="天数" required>
                          <el-input-number v-model="shefuForm.num1" :min="1" :max="999" controls-position="right" class="w-full" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="地数" required>
                          <el-input-number v-model="shefuForm.num2" :min="1" :max="999" controls-position="right" class="w-full" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="人数" required>
                          <el-input-number v-model="shefuForm.num3" :min="1" :max="999" controls-position="right" class="w-full" />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <div class="flex-buttons" style="margin-top: 10px;">
                      <el-button type="info" plain class="flex-1" @click="generateRandomNumbers">
                        ⚡ 凝聚天机
                      </el-button>
                      <el-button type="primary" class="flex-2" :loading="shefuLoading" @click="startShefu">
                        🔮 开启数字射覆
                      </el-button>
                    </div>
                  </el-form>
                </div>
              </el-col>

              <!-- 射覆推理及核对区 -->
              <el-col :xs="24" :md="14" style="margin-bottom: 20px;">
                <!-- 默认提示 -->
                <div v-if="!shefuLoading && !shefuResultVisible" class="shefu-placeholder text-center">
                  <div class="divination-disc animate-spin-slow">☯</div>
                  <p class="mt-15">默想一物（如水杯、钥匙、书本、手机等），<br>输入天、地、人三才感应数，点击按钮开启射覆推演。</p>
                </div>

                <!-- 加载中 -->
                <div v-if="shefuLoading" class="shefu-loading-box text-center">
                  <div class="yin-yang-spinner">☯</div>
                  <p class="mt-15 scanning">正在凝聚精神，解构天地数理，五行法理推算中...</p>
                </div>

                <!-- 射覆结果 -->
                <div v-if="!shefuLoading && shefuResultVisible && shefuResult" class="shefu-result-box animate-fade-in">
                  <!-- 卦象与五行 -->
                  <div class="shefu-header" style="margin-bottom: 15px;">
                    <div class="shefu-symbol">{{ shefuResult.symbol }}</div>
                    <div class="shefu-title">
                      <h4>射覆得卦：【{{ shefuResult.name }}卦】</h4>
                      <p>五行属性：<span class="element-tag" :class="shefuResult.element">{{ shefuResult.elementName }}</span></p>
                    </div>
                  </div>

                  <!-- 物性特征推导 -->
                  <div class="properties-grid" style="margin-bottom: 15px;">
                    <div class="prop-card">
                      <span class="prop-label">📐 外形特征</span>
                      <span class="prop-val">{{ shefuResult.shape }}</span>
                    </div>
                    <div class="prop-card">
                      <span class="prop-label">🔩 材质感官</span>
                      <span class="prop-val">{{ shefuResult.material }}</span>
                    </div>
                    <div class="prop-card">
                      <span class="prop-label">🎨 颜色线索</span>
                      <span class="prop-val">{{ shefuResult.color }}</span>
                    </div>
                    <div class="prop-card">
                      <span class="prop-label">🔍 覆盖空间</span>
                      <span class="prop-val">{{ shefuResult.space }}</span>
                    </div>
                  </div>

                  <!-- 神射猜物结果 -->
                  <div class="guessing-verdict" style="margin-bottom: 15px;">
                    <p class="verdict-lead">🔮 卦象昭示，覆下所藏极有可能是：</p>
                    <div class="verdict-main">{{ shefuResult.bestGuess }}</div>
                    <p class="verdict-candidates">
                      或为其他相近物：
                      <span v-for="(item, idx) in shefuResult.candidates" :key="idx" class="candidate-tag">
                        {{ item }}
                      </span>
                    </p>
                  </div>

                  <!-- 反馈核对区 -->
                  <div v-if="!feedbackGiven" class="feedback-action-box">
                    <p class="feedback-title">系统猜测准确吗？请核对：</p>
                    <div class="action-buttons">
                      <el-button type="success" size="default" :icon="CircleCheck" @click="submitFeedback(true)">
                        🎯 射中了！太准了！
                      </el-button>
                      <el-button type="danger" size="default" :icon="CircleClose" @click="submitFeedback(false)">
                        ❌ 没射中，不沾边
                      </el-button>
                    </div>
                  </div>

                  <!-- 核对后的反馈 -->
                  <div v-else class="feedback-result-panel" :class="shefuHit ? 'panel-success' : 'panel-fail'">
                    <div v-if="shefuHit">
                      <h5>🎉 天机洞穿！恭喜射中！</h5>
                      <p>数字感应精妙契合，八卦法象万物类聚，果真是「{{ shefuResult.bestGuess }}」！</p>
                    </div>
                    <div v-else>
                      <h5>💡 天机微偏，尚需修行</h5>
                      <div v-if="!realItemSubmitted" class="submit-real-item">
                        <p>您刚才心中默想的物品其实是：</p>
                        <div style="display:flex;gap:8px;" class="mt-5">
                          <el-input v-model="realItemName" placeholder="如：鼠标" size="small" style="max-width:200px" />
                          <el-button type="warning" size="small" @click="submitRealItem">提交纠正</el-button>
                        </div>
                      </div>
                      <div v-else>
                        <p>原来是「{{ realItemName }}」！</p>
                        <p class="reflection-text">分析反思：{{ getShefuReflection() }}</p>
                      </div>
                    </div>
                    <el-button type="primary" link size="small" class="mt-10" @click="resetShefuGame">
                      🔄 再玩一次
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Solar } from 'lunar-javascript'
import { Opportunity, Notebook, MagicStick, Compass, Search, Calendar, MapLocation, Share, Refresh, InfoFilled, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// ==========================================
// 五行颜色辅助
// ==========================================
const fiveElements = [
  { name: '金', label: '金（白）', color: '#64748b' },
  { name: '木', label: '木（青）', color: '#10b981' },
  { name: '水', label: '水（黑）', color: '#3b82f6' },
  { name: '火', label: '火（红）', color: '#ef4444' },
  { name: '土', label: '土（黄）', color: '#d97706' }
]

const getElementColor = (el) => {
  const map = { '金': '#64748b', '木': '#10b981', '水': '#3b82f6', '火': '#ef4444', '土': '#d97706' }
  return map[el] || '#64748b'
}

// ==========================================
// 八卦卦画核心基础信息表
// ==========================================
const baguaBase = {
  1: { id: 1, name: '乾', symbol: '☰', nature: '天', element: '金', yinYang: '阳', desc: '至健至刚，天行健，自强不息', trigram: [1, 1, 1], color: '#64748b' },
  2: { id: 2, name: '兑', symbol: '☱', nature: '泽', element: '金', yinYang: '阴', desc: '喜悦沟通，丽泽兑，朋友相学', trigram: [1, 1, 0], color: '#94a3b8' },
  3: { id: 3, name: '离', symbol: '☲', nature: '火', element: '火', yinYang: '阴', desc: '光明美丽，明两作照，守中正', trigram: [1, 0, 1], color: '#dc2626' },
  4: { id: 4, name: '震', symbol: '☳', nature: '雷', element: '木', yinYang: '阳', desc: '变动爆发，雷震千里，警醒自修', trigram: [1, 0, 0], color: '#16a34a' },
  5: { id: 5, name: '巽', symbol: '☴', nature: '风', element: '木', yinYang: '阴', desc: '无孔不入，柔顺渗透，申命行事', trigram: [0, 1, 1], color: '#a855f7' },
  6: { id: 6, name: '坎', symbol: '☵', nature: '水', element: '水', yinYang: '阳', desc: '坎坷险陷，沉淀心智，常德行进', trigram: [0, 1, 0], color: '#1e3a8a' },
  7: { id: 7, name: '艮', symbol: '☶', nature: '山', element: '土', yinYang: '阳', desc: '静止阻碍，安如磐石，适可而止', trigram: [0, 0, 1], color: '#0284c7' },
  8: { id: 8, name: '坤', symbol: '☷', nature: '地', element: '土', yinYang: '阴', desc: '包容厚德，坤厚载物，德合无疆', trigram: [0, 0, 0], color: '#db2777' }
}

// 六十四卦经典组合词典
const sixtyFourGua = {
  "1-1": { name: "乾为天", desc: "至健大吉。天行健，自强不息。名利双收之象。" }, "1-2": { name: "天泽履", desc: "如履薄冰。礼待他人，防微杜渐，谨慎则吉。" }, "1-3": { name: "天火同人", desc: "天下大同。志同道合，团结协作，无往不利。" }, "1-4": { name: "天雷无妄", desc: "顺应天意。坚守正道，切勿妄动，平实无怨。" }, "1-5": { name: "天风姤", desc: "邂逅相遇。防范暗流，女强男弱，顺其自然。" }, "1-6": { name: "天水讼", desc: "争讼克制。防口舌争端，宜和为贵，退一步海阔天空。" }, "1-7": { name: "天山遁", desc: "退避隐遁。蓄势待发，明哲保身，适时隐退为上。" }, "1-8": { name: "天地否", desc: "闭塞不通。上下不合，小人得势，坚守贞固以待黎明。" },
  "2-1": { name: "泽天夬", desc: "决断清除。决而能和，刚柔相济，防小人暗算。" }, "2-2": { name: "兑为泽", desc: "喜悦交流。丽泽对讲，朋友相帮，言谈有度则吉。" }, "2-3": { name: "泽火革", desc: "顺天应人。变革创新，改弦更张，大吉可期。" }, "2-4": { name: "泽雷随", desc: "随遇而安。顺应潮流，择善而从，自得平安。" }, "2-5": { name: "泽风大过", desc: "栋梁折曲。压力过重，需稳健调节，不可强出头。" }, "2-6": { name: "泽水困", desc: "穷困坚守. 龙游浅水，坚守正道，岁寒知松柏。" }, "2-7": { name: "泽山咸", desc: "心灵感应。少男少女，相互吸引，心有灵犀，万事皆吉。" }, "2-8": { name: "泽地萃", desc: "精英汇聚。萃聚一堂，财源大茂，得众力支持。" },
  "3-1": { name: "火天大有", desc: "日丽中天。大有收获，富足宽容，顺天依时。" }, "3-2": { name: "火泽睽", desc: "同而不同。求同存异，防背道而驰，以柔克刚。" }, "3-3": { name: "离为火", desc: "光明附着。明两作照，前途坦荡，宜守中正。" }, "3-4": { name: "火雷噬嗑", desc: "刚正严明。排除万难，赏罚分明，宜快速决断。" }, "3-5": { name: "火风鼎", desc: "三足鼎立。协力图新，贤才得用，基业稳固。" }, "3-6": { name: "火水未济", desc: "黎明前夕。事情尚未完结，虽有困难但大有希望。" }, "3-7": { name: "火山旅", desc: "羁旅漂泊。不安于室，在外奔波，守正防破财。" }, "3-8": { name: "火地晋", desc: "旭日东升。仕途坦荡，步步高升，大受器重。" },
  "4-1": { name: "雷天大壮", desc: "声势浩大。阳气鼎盛，防亢龙有悔，宜中庸稳重。" }, "4-2": { name: "雷泽归妹", desc: "终难长久。防主次颠倒，宜按部就班，不可急躁功利。" }, "4-3": { name: "雷火丰", desc: "丰盛璀璨。如日中天，宜居安思危，防盛极而衰。" }, "4-4": { name: "震为雷", desc: "春雷炸响。震惊百里，警醒自修，先惊后喜。" }, "4-5": { name: "雷风恒", desc: "持之以恒。雷风相助，恒心能成，夫妻和睦。" }, "4-6": { name: "雷水解", desc: "冰消瓦解。转危为安，排除阻碍，宜快速推进。" }, "4-7": { name: "雷山小过", desc: "小有过越。宜下不宜上，宜静不宜动，小事能成。" }, "4-8": { name: "雷地豫", desc: "喜乐安豫。顺时依势，防玩物丧志，宜居安思危。" },
  "5-1": { name: "风天小畜", desc: "密云不雨。蓄积力量，小有收获，耐心等待时机。" }, "5-2": { name: "风泽中孚", desc: "诚信立身。心中诚信，感化他人，谋望皆能实现。" }, "5-3": { name: "风火家人", desc: "齐家之道。内政井然，各司其职，家和万事兴。" }, "5-4": { name: "风雷益", desc: "损上益下。利涉大川，大有作为，天施地生。" }, "5-5": { name: "巽为风", desc: "顺风渗透。申命行事，随风潜入，宜多用计谋。" }, "5-6": { name: "风水涣", desc: "冰消瓦解。扬帆起航，消解隔阂，重聚人心。" }, "5-7": { name: "风山渐", desc: "鸿渐于陆。循序渐进，积少成多，前途不可限量。" }, "5-8": { name: "风地观", desc: "高瞻远瞩。观摩学习，宜静修反思，以德化人。" },
  "6-1": { name: "水天需", desc: "云行于天。耐心等待，蓄水养息，终能大展宏图。" }, "6-2": { name: "水泽节", desc: "节制有度. 甘节自甘，防奢侈无度，适度调节则吉。" }, "6-3": { name: "水火既济", desc: "功成圆满。诸事皆顺，宜防备松懈，守成防衰。" }, "6-4": { name: "水雷屯", desc: "草创维艰。万事开头难，宜广结善缘，积蓄力量。" }, "6-5": { name: "水风井", desc: "源源不断。养人无方，守常不改，财源细水长流。" }, "6-6": { name: "坎为水", desc: "重重险陷。常德行进，沉淀心智，必能脱困。" }, "6-7": { name: "水山蹇", desc: "雪上加霜。前路受阻，宜反求诸己，宜往西南吉。" }, "6-8": { name: "水地比", desc: "亲密比辅。广结人缘，得众人拥护，先吉后平。" },
  "7-1": { name: "山天大畜", desc: "大有积蓄。藏器于身，广积粮草，大有作为。" }, "7-2": { name: "山泽损", desc: "损己利人。惩忿窒欲，虽有付出，终能有大报。" }, "7-3": { name: "山火贲", desc: "文饰装点。白贲无咎，讲求内外兼修，适度包装。" }, "7-4": { name: "山雷颐", desc: "修身养性。慎言语，节饮食，保重身体则吉。" }, "7-5": { name: "山风蛊", desc: "推陈出新。整治积弊，勇于自我革新，终能重振旗鼓。" }, "7-6": { name: "山水蒙", desc: "启蒙发慧。虚心求教，果行育德，渐入佳境。" }, "7-7": { name: "艮为山", desc: "安如磐石。思不出位，动静得宜，适可而止。" }, "7-8": { name: "山地剥", desc: "剥落衰退。小人势力上升，宜顺应退守，静待冬去春来。" },
  "8-1": { name: "地天泰", desc: "三阳开泰。上下交泰，诸事顺遂，国泰民安，大吉大利。" }, "8-2": { name: "地泽临", desc: "大兵临境。亲自督导，防盛极而衰，宜柔中克刚。" }, "8-3": { name: "地火明夷", desc: "韬光养晦。伤于明处，宜藏锋避祸，心怀正念。" }, "8-4": { name: "地雷复", desc: "一阳复始。重获新生，循环往复，前景渐渐光明。" }, "8-5": { name: "地风升", desc: "步步高升。柔顺上升，得贤才提拔，积少成多。" }, "8-6": { name: "地水师", desc: "行军出征。大众一心，统帅得力，虽有劳累终有成。" }, "8-7": { name: "地山谦", desc: "虚怀若谷。谦谦君子，卑以自牧，万事皆能化险为夷。" }, "8-8": { name: "坤为地", desc: "厚德载物。至柔至顺，包容万物，得主有常。" }
}

const lunarYearOptions = [
  { value: 1, label: '子鼠 (1)' }, { value: 2, label: '丑牛 (2)' },
  { value: 3, label: '寅虎 (3)' }, { value: 4, label: '卯兔 (4)' },
  { value: 5, label: '辰龙 (5)' }, { value: 6, label: '巳蛇 (6)' },
  { value: 7, label: '午马 (7)' }, { value: 8, label: '未羊 (8)' },
  { value: 9, label: '申猴 (9)' }, { value: 10, label: '酉鸡 (10)' },
  { value: 11, label: '戌狗 (11)' }, { value: 12, label: '亥猪 (12)' }
]

const lunarHourOptions = [
  { value: 1, label: '子时 23:00~01:00 (1)' }, { value: 2, label: '丑时 01:00~03:00 (2)' },
  { value: 3, label: '寅时 03:00~05:00 (3)' }, { value: 4, label: '卯时 05:00~07:00 (4)' },
  { value: 5, label: '辰时 07:00~09:00 (5)' }, { value: 6, label: '巳时 09:00~11:00 (6)' },
  { value: 7, label: '午时 11:00~13:00 (7)' }, { value: 8, label: '未时 13:00~15:00 (8)' },
  { value: 9, label: '申时 15:00~17:00 (9)' }, { value: 10, label: '酉时 17:00~19:00 (10)' },
  { value: 11, label: '戌时 19:00~21:00 (11)' }, { value: 12, label: '亥时 21:00~23:00 (12)' }
]

// ==========================================
// 选项卡状态
// ==========================================
const activeDeduceTab = ref('plum')

// ==========================================
// 梅花易数起卦状态与逻辑
// ==========================================
const plumParams = reactive({
  type: 'time',
  lunarYear: 7, lunarMonth: 5, lunarDay: 15, lunarHour: 7,
  num1: 520, num2: 1314, num3: null
})
const isDeducing = ref(false)
const deducingStep = ref(0)
const plumResult = ref(null)

const randomizePlumNums = () => {
  plumParams.num1 = Math.floor(Math.random() * 9999) + 1
  plumParams.num2 = Math.floor(Math.random() * 9999) + 1
  plumParams.num3 = Math.floor(Math.random() * 999) + 1
}

const calculatePlumBlossom = () => {
  isDeducing.value = true
  deducingStep.value = 1
  setTimeout(() => {
    let upperGuaNum = 1, lowerGuaNum = 1, movingYao = 1
    if (plumParams.type === 'time') {
      const upSum = plumParams.lunarYear + plumParams.lunarMonth + plumParams.lunarDay
      const upRem = upSum % 8; upperGuaNum = upRem === 0 ? 8 : upRem
      const downSum = upSum + plumParams.lunarHour
      const downRem = downSum % 8; lowerGuaNum = downRem === 0 ? 8 : downRem
      const yaoRem = downSum % 6; movingYao = yaoRem === 0 ? 6 : yaoRem
    } else {
      const n1 = plumParams.num1 || 1, n2 = plumParams.num2 || 1, n3 = plumParams.num3
      const upRem = n1 % 8; upperGuaNum = upRem === 0 ? 8 : upRem
      const downRem = n2 % 8; lowerGuaNum = downRem === 0 ? 8 : downRem
      if (n3 !== undefined && n3 !== null && n3 !== '') {
        const yaoRem = n3 % 6; movingYao = yaoRem === 0 ? 6 : yaoRem
      } else {
        const yaoRem = (n1 + n2) % 6; movingYao = yaoRem === 0 ? 6 : yaoRem
      }
    }
    const upGua = baguaBase[upperGuaNum], downGua = baguaBase[lowerGuaNum]
    const benGuaCode = `${upperGuaNum}-${lowerGuaNum}`
    const benGuaInfo = sixtyFourGua[benGuaCode] || { name: '未知卦', desc: '乾坤变通，玄之又玄。' }
    const benYao = [...downGua.trigram, ...upGua.trigram]
    const huDownTrigram = [benYao[1], benYao[2], benYao[3]]
    const huUpTrigram = [benYao[2], benYao[3], benYao[4]]
    const findBaguaIdByTrigram = (tri) => { for (const id in baguaBase) { const baseTri = baguaBase[id].trigram; if (baseTri[0] === tri[0] && baseTri[1] === tri[1] && baseTri[2] === tri[2]) return parseInt(id) } return 8 }
    const huLowerGuaNum = findBaguaIdByTrigram(huDownTrigram), huUpperGuaNum = findBaguaIdByTrigram(huUpTrigram)
    const huGuaCode = `${huUpperGuaNum}-${huLowerGuaNum}`
    const huGuaInfo = sixtyFourGua[huGuaCode] || { name: '未知互卦', desc: '事态发展的中间起伏和内因。' }
    const huYao = [...huDownTrigram, ...huUpTrigram]
    const bianYao = [...benYao]; bianYao[movingYao - 1] = benYao[movingYao - 1] === 1 ? 0 : 1
    const bianDownTrigram = [bianYao[0], bianYao[1], bianYao[2]], bianUpTrigram = [bianYao[3], bianYao[4], bianYao[5]]
    const bianLowerGuaNum = findBaguaIdByTrigram(bianDownTrigram), bianUpperGuaNum = findBaguaIdByTrigram(bianUpTrigram)
    const bianGuaCode = `${bianUpperGuaNum}-${bianLowerGuaNum}`
    const bianGuaInfo = sixtyFourGua[bianGuaCode] || { name: '未知变卦', desc: '事态演变的最终局势和走向。' }
    let tiGua, yongGua, isTiUp = false
    if (movingYao >= 4) { tiGua = downGua; yongGua = upGua } else { tiGua = upGua; yongGua = downGua; isTiUp = true }
    const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }
    const ke = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }
    const tiEl = tiGua.element, yongEl = yongGua.element
    let relation = '', relationDesc = '', luckLevel = '', luckDesc = ''
    if (tiEl === yongEl) { relation = '比和'; relationDesc = `体卦【${tiGua.name}】与用卦【${yongGua.name}】五行同属【${tiEl}】，比肩并茂。`; luckLevel = '吉（比和）'; luckDesc = '体用比和为平稳亨通之象。代表谋事可得平辈、同道或合作伙伴鼎力协作，不偏不倚，稳扎稳打即可成事。' }
    else if (sheng[yongEl] === tiEl) { relation = '用生体'; relationDesc = `用卦之【${yongEl}】生扶体卦之【${tiEl}】。`; luckLevel = '大吉（生入）'; luckDesc = '用生体为万事大吉之兆。预示外力大为受益，贵人扶掖，资财与机遇主动送上门来，诸般谋望皆能顺心顺意！' }
    else if (sheng[tiEl] === yongEl) { relation = '体生用'; relationDesc = `体卦之【${tiEl}】泄气生扶用卦之【${yongEl}】。`; luckLevel = '小凶（生出/泄气）'; luckDesc = '体生用代表消耗泄气。预示做此事需耗费您极大的精力、物力、财力，容易事倍功半、过度透支。建议防微杜渐，量力而行。' }
    else if (ke[tiEl] === yongEl) { relation = '体克用'; relationDesc = `体卦之【${tiEl}】降服克服用卦之【${yongEl}】。`; luckLevel = '小吉（克出）'; luckDesc = '体克用代表所求之事在自身掌控之下。虽然推进过程中伴随诸多竞争与磨难，但最终可通过自身实力克难克坚，夺得胜利果实！' }
    else if (ke[yongEl] === tiEl) { relation = '用克体'; relationDesc = `用卦之【${yongEl}】克制克伤体卦之【${tiEl}】。`; luckLevel = '大凶（克入/克伤）'; luckDesc = '用克体为压力重重、行事受阻之象。预示近期易伴随口舌、小人暗箭或财物损耗，压力极大。此时不宜轻率突围，宜静守贞固，韬光养晦。' }
    plumResult.value = { movingYao, tiGua, yongGua, isTiUp, relation, relationDesc, luckLevel, luckDesc, ben: { code: benGuaCode, name: benGuaInfo.name, desc: benGuaInfo.desc, upGua, downGua, yao: benYao }, hu: { code: huGuaCode, name: huGuaInfo.name, desc: huGuaInfo.desc, upGua: baguaBase[huUpperGuaNum], downGua: baguaBase[huLowerGuaNum], yao: huYao }, bian: { code: bianGuaCode, name: bianGuaInfo.name, desc: bianGuaInfo.desc, upGua: baguaBase[bianUpperGuaNum], downGua: baguaBase[bianLowerGuaNum], yao: bianYao } }
    isDeducing.value = false; deducingStep.value = 2
  }, 1000)
}

const getClerkYaoName = (num) => {
  const names = { 1: '初爻', 2: '二爻', 3: '三爻', 4: '四爻', 5: '五爻', 6: '上爻' }
  return names[num] || ''
}

const getLuckClass = (level) => {
  if (!level) return 'luck-neutral'
  if (level.includes('大吉')) return 'luck-big-win'
  if (level.includes('大凶')) return 'luck-big-loss'
  if (level.includes('小吉')) return 'luck-small-win'
  if (level.includes('小凶')) return 'luck-small-loss'
  return 'luck-neutral'
}

// ==========================================
// 生辰八字状态与逻辑
// ==========================================
const baziParams = reactive({ solarYear: 1995, solarMonth: 8, solarDay: 18, solarHour: 12 })
const baziDeducing = ref(false)
const baziDeducingStep = ref(0)
const baziResult = ref(null)

const baziStemMeta = {
  '甲': { element: '木', polar: '阳' }, '乙': { element: '木', polar: '阴' },
  '丙': { element: '火', polar: '阳' }, '丁': { element: '火', polar: '阴' },
  '戊': { element: '土', polar: '阳' }, '己': { element: '土', polar: '阴' },
  '庚': { element: '金', polar: '阳' }, '辛': { element: '金', polar: '阴' },
  '壬': { element: '水', polar: '阳' }, '癸': { element: '水', polar: '阴' }
}

const getTenGod = (dayGan, targetGan) => {
  if (!dayGan || !targetGan) return '比肩'
  const me = baziStemMeta[dayGan], target = baziStemMeta[targetGan]
  if (!me || !target) return '比肩'
  const relationMatrix = { '木': { '木': '比劫', '火': '食伤', '土': '财星', '金': '官杀', '水': '印星' }, '火': { '火': '比劫', '土': '食伤', '金': '财星', '水': '官杀', '木': '印星' }, '土': { '土': '比劫', '金': '食伤', '水': '财星', '木': '官杀', '火': '印星' }, '金': { '金': '比劫', '水': '食伤', '木': '财星', '火': '官杀', '土': '印星' }, '水': { '水': '比劫', '木': '食伤', '火': '财星', '土': '官杀', '金': '印星' } }
  const type = relationMatrix[me.element][target.element]
  const isSamePolar = me.polar === target.polar
  const tenGodNames = { '比劫': isSamePolar ? '比肩' : '劫财', '食伤': isSamePolar ? '食神' : '伤官', '财星': isSamePolar ? '偏财' : '正财', '官杀': isSamePolar ? '七杀' : '正官', '印星': isSamePolar ? '偏印' : '正印' }
  return tenGodNames[type]
}

const getHideGan = (branch) => {
  const hides = { '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'], '卯': ['乙'], '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'], '午': ['丁', '己'], '未': ['己', '丁', '乙'], '申': ['庚', '壬', '戊'], '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲'] }
  return hides[branch] || []
}

const getBaziAdvice = (dayGan) => {
  const advices = {
    '甲': { title: '甲木命主 · 顶天立地', character: '正直善良、极具进取心，拥有领袖气质与栋梁之材。但有时过于固执偏激，不愿妥协。', destiny: '如参天大树，生机勃勃。春生则贵，夏生则秀，秋生有成，冬生需阳。一生多得贵人提携，志向高远。', advice: '多注意倾听他人意见，凡事留有余地，刚柔并济，运势会更加顺遂。', poem: '独木成林壮志扬，直冲云霄立庙堂。柔顺调和纳百川，乾坤稳步福禄长。' },
    '乙': { title: '乙木命主 · 坚韧秀雅', character: '温柔顺从、适应能力强，富有同理心与艺术细胞，具有野草般的坚韧生命力。', destiny: '如藤萝花草，灵动蔓延。一生人缘极佳，处事圆滑，以柔克刚。', advice: '坚定信念，培养独立决断的勇气，遇到困难多相信自己的直觉。', poem: '春风野草绿漫天，柔韧随风化险难。立定乾坤求自强，芳华满路福寿全。' },
    '丙': { title: '丙火命主 · 艳阳高照', character: '热情大方、光明磊落、充满活力，乐于助人并极具号召力。', destiny: '如太阳之火，普照大地。一生行事光明，事业有开拓性。', advice: '修身养性，克制急躁情绪，做事讲求循序渐进与持之以恒。', poem: '烈日当空照九天，胸怀坦荡众生怜。中和克制调火气，福泽绵长瑞气缠。' },
    '丁': { title: '丁火命主 · 烛照幽微', character: '温和有礼、心思细腻、内敛且极具奉献精神。', destiny: '如人间烛火、星光。一生多有特殊才华，适合钻研与谋划。', advice: '放宽心胸，凡事不要过多纠结与计较，适时释放内心压力。', poem: '一点荧光烛火明，幽微深处见真情。通达明理修慧眼，福禄双全万事兴。' },
    '戊': { title: '戊土命主 · 重厚宽广', character: '沉稳厚重、忠实守信、包容力强。', destiny: '如泰山之土，能防水能生金。一生性格稳健，得人信赖。', advice: '多接受新事物，打破固有习惯，积极主动地进行人际交往。', poem: '厚德载物稳如山，万物生生赖此宽。变通革新迎朝旭，乾坤造化福常安。' },
    '己': { title: '己土命主 · 田园孕育', character: '宽容包容、心地善良、多才多艺。', destiny: '如湿土田园，善于孕育万物。一生多为贤内助或核心助手。', advice: '培养独立做决定的勇气，增强自身魄力与领导气场。', poem: '田园湿土育英华，温润无声绽万花。坚定刚毅自立志，福运千秋至我家。' },
    '庚': { title: '庚金命主 · 刚毅果决', character: '刚强果断、讲义气、执行力极强。', destiny: '如刀剑之金，需要火炼、水泄。一生多能担当重任，杀伐果决。', advice: '言语温和一些，学会妥协与以柔克刚。', poem: '百炼成钢化纯锋，披荆斩棘建奇功。慈悲温润调刚烈，万事亨通福禄融。' },
    '辛': { title: '辛金命主 · 珠玉温润', character: '温润独特、精致追求完美、思维细腻。', destiny: '如金银珠宝，喜壬水淘洗。一生气质高雅。', advice: '脚踏实地，不要过度在意他人眼光。', poem: '珠玉玲珑照眼明，澄澈淘沙现至真。不逐虚华求实学，福泽深厚保安平。' },
    '壬': { title: '壬水命主 · 江河奔腾', character: '智慧超群、大局观强、有远见与胸怀。', destiny: '如江河湖海，滚滚向前。一生多有大作为，心怀宽广。', advice: '做事要专注，切忌虎头蛇尾。', poem: '江河大水浩无涯，卷起千重万道花。静水流深修定力，福瑞临门万家达。' },
    '癸': { title: '癸水命主 · 灵动雨露', character: '聪明灵动、温柔细心、富有创意。', destiny: '如雨露清泉，滋润万物。一生具有极强的艺术天分与玄学直觉。', advice: '保持开朗乐观，多接触阳光正能量的活动。', poem: '清泉雨露润无声，灵动剔透映乾坤。淡泊宁静修心性，福禄自随运自伸。' }
  }
  return advices[dayGan] || advices['甲']
}

const calculateBaziDestiny = () => {
  baziDeducing.value = true; baziDeducingStep.value = 1
  setTimeout(() => {
    try {
      const y = parseInt(baziParams.solarYear) || 1995, m = parseInt(baziParams.solarMonth) || 8
      const d = parseInt(baziParams.solarDay) || 18, h = parseInt(baziParams.solarHour) || 12
      const solar = Solar.fromYmdHms(y, m, d, h, 0, 0)
      const lunar = solar.getLunar(); const bazi = lunar.getEightChar()
      const yg = bazi.getYearGan(), yz = bazi.getYearZhi(), mg = bazi.getMonthGan(), mz = bazi.getMonthZhi()
      const dg = bazi.getDayGan(), dz = bazi.getDayZhi(), hg = bazi.getTimeGan(), hz = bazi.getTimeZhi()
      const elementCounts = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
      const addStemElement = (gan) => { const meta = baziStemMeta[gan]; if (meta) elementCounts[meta.element]++ }
      const addBranchElement = (zhi) => { const zhiToElement = { '子': '水', '亥': '水', '寅': '木', '卯': '木', '巳': '火', '午': '火', '辰': '土', '戌': '土', '丑': '土', '未': '土', '申': '金', '酉': '金' }; const el = zhiToElement[zhi]; if (el) elementCounts[el]++ }
      addStemElement(yg); addStemElement(mg); addStemElement(dg); addStemElement(hg)
      addBranchElement(yz); addBranchElement(mz); addBranchElement(dz); addBranchElement(hz)
      const elementRates = {}; for (const el in elementCounts) { elementRates[el] = Math.round((elementCounts[el] / 8) * 100) }
      let maxEl = '木', minEl = '木', maxVal = -1, minVal = 999
      for (const el in elementCounts) { if (elementCounts[el] > maxVal) { maxVal = elementCounts[el]; maxEl = el } if (elementCounts[el] < minVal) { minVal = elementCounts[el]; minEl = el } }
      baziResult.value = {
        solarDate: `${y}年${m}月${d}日 ${h}时`, lunarDate: `农历 ${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日`,
        eightCharStr: `${yg}${yz} ${mg}${mz} ${dg}${dz} ${hg}${hz}`,
        columns: [
          { name: '年柱', gan: yg, zhi: yz, nayin: bazi.getYearNaYin(), tenGod: getTenGod(dg, yg), hideGan: getHideGan(yz), ganElement: stemToElementMap[yg], zhiElement: branchToElementMap[yz] },
          { name: '月柱', gan: mg, zhi: mz, nayin: bazi.getMonthNaYin(), tenGod: getTenGod(dg, mg), hideGan: getHideGan(mz), ganElement: stemToElementMap[mg], zhiElement: branchToElementMap[mz] },
          { name: '日柱', gan: dg, zhi: dz, nayin: bazi.getDayNaYin(), tenGod: '日元', hideGan: getHideGan(dz), ganElement: stemToElementMap[dg], zhiElement: branchToElementMap[dz] },
          { name: '时柱', gan: hg, zhi: hz, nayin: bazi.getTimeNaYin(), tenGod: getTenGod(dg, hg), hideGan: getHideGan(hz), ganElement: stemToElementMap[hg], zhiElement: branchToElementMap[hz] }
        ],
        elementRates, elementCounts, maxEl, minEl, advice: getBaziAdvice(dg)
      }
      baziDeducingStep.value = 2
    } catch (err) { console.error(err); baziDeducingStep.value = 0 } finally { baziDeducing.value = false }
  }, 1200)
}

// ==========================================
// 🔮 梅花寻物状态与逻辑
// ==========================================
const form = reactive({
  itemName: '',
  lostTime: '',
  lastLocation: '',
  personality: 'boyfriend'
})
const loading = ref(false)
const resultVisible = ref(false)
const resultData = ref(null)

const hexagrams = [
  { name: "乾", direction: "西北", location: "高处或重要位置", meaning: "天", symbol: "☰", detailed: "乾卦代表天，象征刚健、向上。物品可能在显眼的高处，或者被放在了重要的位置。建议检查书架顶层、柜子上方、办公桌等重要区域。", timeAdvice: "宜在上午阳气旺盛时寻找", tips: "乾卦主动，物品可能被主动移动过，询问他人是否见过" },
  { name: "坤", direction: "西南", location: "低处或角落", meaning: "地", symbol: "☷", detailed: "坤卦代表地，象征柔顺、承载。物品很可能掉落在低处，或者被遗忘在不起眼的角落。重点检查地面、抽屉底部、沙发缝隙等位置。", timeAdvice: "宜在下午或傍晚时分寻找", tips: "坤卦主静，物品可能一直静静躺在某处，需要仔细翻找" },
  { name: "震", direction: "东", location: "有声响的地方附近", meaning: "雷", symbol: "☳", detailed: "震卦代表雷，象征震动、声响。物品可能在有动静的地方，如电器附近、门边、或者经常有人走动的区域。", timeAdvice: "宜在早晨或有活动时寻找", tips: "震卦主动，可能在使用其他物品时一起被移动了" },
  { name: "巽", direction: "东南", location: "通风的地方", meaning: "风", symbol: "☴", detailed: "巽卦代表风，象征流动、散布。物品可能被风吹动，或在通风口、窗边、风扇附近。也可能在经常整理的地方被无意中移动。", timeAdvice: "宜在微风轻拂的时候寻找", tips: "巽卦主散，物品可能被分散放置，检查多个可能的位置" },
  { name: "坎", direction: "北", location: "水源附近或阴暗处", meaning: "水", symbol: "☵", detailed: "坎卦代表水，象征流动、隐藏。物品可能在厨房、卫生间等有水的地方，或者在阴暗、不易察觉的角落。", timeAdvice: "宜在夜晚或阴天时寻找", tips: "坎卦主藏，物品可能被其他东西遮挡或包围" },
  { name: "离", direction: "南", location: "明亮或温暖的地方", meaning: "火", symbol: "☲", detailed: "离卦代表火，象征光明、温暖。物品很可能在阳光充足的地方，如窗台、阳台，或者温暖的区域如暖气片附近、阳光房等。", timeAdvice: "宜在正午阳光最盛时寻找", tips: "离卦主明，物品可能就在显眼的地方，只是被忽略了" },
  { name: "艮", direction: "东北", location: "稳固的地方或高处", meaning: "山", symbol: "☶", detailed: "艮卦代表山，象征稳定、静止。物品可能在固定不动的地方，如书柜、储物柜、或者平时不常动的区域。", timeAdvice: "宜在安静的时候仔细寻找", tips: "艮卦主止，物品可能在平时很少整理的固定位置" },
  { name: "兑", direction: "西", location: "开阔或有水的地方", meaning: "泽", symbol: "☱", detailed: "兑卦代表泽，象征喜悦、开放。物品可能在开阔的空间，如客厅中央、阳台、或者让人心情愉悦的地方。", timeAdvice: "宜在心情愉快时寻找", tips: "兑卦主悦，保持轻松心态，物品可能在意想不到的地方出现" }
]

const personalities = {
  boyfriend: {
    name: "男友鼓励式",
    avatar: "💕",
    greeting: ["宝贝别着急", "亲爱的不要担心", "宝宝我来帮你"],
    advice: [
      "我觉得你可以去{location}找找看，相信我的直觉！",
      "宝贝，试试往{direction}方向找，我有预感就在那里",
      "别急，我陪你一起找，先去{location}看看好不好？"
    ],
    encouragement: ["相信自己，你一定能找到的！我永远支持你💕", "别灰心，有我在呢，我们慢慢找", "你这么聪明，肯定很快就能找到的！"]
  },
  mom: {
    name: "妈妈批评式",
    avatar: "👩‍👧‍👦",
    greeting: ["你这孩子", "又丢东西了", "怎么这么不小心"],
    advice: [
      "我就说了多少遍要放好！现在去{location}找找，记住了吗？",
      "肯定又是随手一放！赶紧去{direction}方向找找",
      "下次长点记性！先去{location}翻翻看"
    ],
    encouragement: ["找到了记得告诉妈妈，以后要仔细点！", "妈妈虽然说你，但还是希望你能找到", "这次找到了，下次可不能再这样了！"]
  },
  bestie: {
    name: "闺蜜吐槽式",
    avatar: "👯‍♀️",
    greeting: ["姐妹你又来了", "哈哈又丢东西", "我就知道"],
    advice: [
      "我猜肯定在{location}，你就是这么没条理！",
      "试试{direction}方向吧，虽然你的记性我不太信任😏",
      "去{location}找找，不过你确定记得住路吗？"
    ],
    encouragement: ["找到了请我喝奶茶！毕竟我这么聪明帮你分析", "下次出门前记得检查，省得又来麻烦我", "虽然吐槽你，但还是希望你快点找到啦~"]
  },
  master: {
    name: "大师指点式",
    avatar: "🧙‍♂️",
    greeting: ["施主莫慌", "天机不可泄露", "且听老夫一言"],
    advice: [
      "卦象显示，{direction}方向有异象，{location}或有所获",
      "天机昭示，往{location}寻觅，必有收获",
      "依老夫推算，{direction}方位藏玄机，{location}见真章"
    ],
    encouragement: ["缘起缘灭，失而复得，此乃天意", "心诚则灵，静心寻觅，必有所得", "万物有灵，失物自会归来，莫要心急"]
  },
  cute: {
    name: "萌宠陪伴式",
    avatar: "🐱",
    greeting: ["主人不要难过", "喵~又丢东西了", "汪汪~我来帮忙"],
    advice: [
      "小爪爪告诉我，{location}有好闻的味道哦~",
      "我的小鼻子闻到了，{direction}方向有发现！",
      "跟着我的小尾巴，去{location}找找看吧~"
    ],
    encouragement: ["找到了记得摸摸我的小脑袋~", "主人最棒了！一定能找到的喵~", "我会一直陪着主人的，汪汪！"]
  }
}

const getRandomElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const startDivining = () => {
  if (!form.itemName || !form.itemName.trim()) {
    ElMessage.warning('请填写您丢失的物品名称！')
    return
  }
  if (!form.lostTime || !form.lostTime.trim()) {
    ElMessage.warning('请填写大概丢失的时间！')
    return
  }
  if (!form.lastLocation || !form.lastLocation.trim()) {
    ElMessage.warning('请填写最后一次见到该物品的地点！')
    return
  }

  loading.value = true
  resultVisible.value = false

  setTimeout(() => {
    const itemStr = form.itemName.trim()
    const timeStr = form.lostTime.trim()
    const locationStr = form.lastLocation.trim()
    
    const minutes = new Date().getMinutes()
    const seed = (itemStr + timeStr + locationStr).length + minutes
    const hexagramIndex = seed % hexagrams.length
    const selectedHexagram = hexagrams[hexagramIndex]
    
    const personality = personalities[form.personality]
    const greeting = getRandomElement(personality.greeting)
    const rawAdvice = getRandomElement(personality.advice)
    
    const advice = rawAdvice
      .replace('{location}', selectedHexagram.location)
      .replace('{direction}', selectedHexagram.direction)
    const encouragement = getRandomElement(personality.encouragement)

    const calculations = doCalculations(itemStr, timeStr, locationStr, selectedHexagram, minutes)

    resultData.value = {
      hexagram: selectedHexagram,
      greeting,
      advice,
      encouragement,
      calculations
    }

    loading.value = false
    resultVisible.value = true
  }, 1800)
}

const doCalculations = (item, time, location, hexagram, minutes) => {
  const itemNum = item.length
  const timeNum = time.length
  const locationNum = location.length
  const currentTime = new Date()
  const hour = currentTime.getHours()
  
  const upperVal = itemNum + timeNum
  const lowerVal = locationNum + minutes
  const movingVal = itemNum + timeNum + locationNum + minutes

  return {
    item, itemNum,
    time, timeNum,
    location, locationNum,
    hour, minute: minutes,
    upperDiv: Math.floor(upperVal / 8),
    upperRemainder: upperVal % 8,
    lowerDiv: Math.floor(lowerVal / 8),
    lowerRemainder: lowerVal % 8,
    movingDiv: Math.floor(movingVal / 6),
    movingRemainder: movingVal % 6,
    symbol: hexagram.symbol,
    name: hexagram.name,
    meaning: hexagram.meaning,
    direction: hexagram.direction,
    locationDesc: hexagram.location,
    tips: hexagram.tips,
    detailed: hexagram.detailed
  }
}

const shareResult = () => {
  const styleName = personalities[form.personality].name
  const text = `我刚用「梅花寻物」算了一卦，寻得我的 [${form.itemName}] 大概率在 [${resultData.value.hexagram.direction}方位（${resultData.value.hexagram.location}）]，[${styleName}]的回复笑死我了。你也快来看看你的失物在哪儿吧！`
  
  if (navigator.share) {
    navigator.share({
      title: '梅花寻物 - 失物卦象指引',
      text: text,
      url: window.location.href
    }).catch(err => {
      console.log(err)
    })
  } else {
    navigator.clipboard.writeText(text + ' ' + window.location.href)
      .then(() => {
        ElMessage.success('寻物文案及链接已成功复制到剪贴板，去分享给好友吧！')
      })
      .catch(() => {
        ElMessage.error('复制到剪贴板失败，请手动选择复制分享文本。')
      })
  }
}

const resetForm = () => {
  form.itemName = ''
  form.lostTime = ''
  form.lastLocation = ''
  form.personality = 'boyfriend'
  resultVisible.value = false
  resultData.value = null
}

// ==========================================
// 🤫 梅花射覆游戏状态与逻辑
// ==========================================
const shefuForm = reactive({
  num1: 1,
  num2: 1,
  num3: 1
})
const shefuLoading = ref(false)
const shefuResultVisible = ref(false)
const shefuResult = ref(null)
const feedbackGiven = ref(false)
const shefuHit = ref(false)
const realItemSubmitted = ref(false)
const realItemName = ref('')

const shefuStats = reactive({
  total: 0,
  hits: 0,
  rate: 0
})

const shefuDatabase = {
  0: { name: "乾天", symbol: "☰", element: "metal", elementName: "金", shape: "圆而坚实，大器端庄", material: "金玉、金属、贵重钢铁、质地极硬之物", color: "金黄色、白金色、纯白色", space: "宜在上方、高处、金属器皿内部或显眼重要位置", bestGuess: "硬币", candidates: ["手表", "金属徽章", "印章", "金属戒指"] },
  1: { name: "兑泽", symbol: "☱", element: "metal", elementName: "金", shape: "小巧且表面有凹凸，或有开口、折断状", material: "铜铁、金银饰品、带金属发声孔的细小物件", color: "金属色、银白色、淡黄色", space: "宜在浅处、口袋中、小盒子内或随手丢弃处", bestGuess: "钥匙", candidates: ["指甲刀", "蓝牙耳机", "小别针", "金属首饰"] },
  2: { name: "离火", symbol: "☲", element: "fire", elementName: "火", shape: "表面美丽精装，中空结构，或带发光屏/镜面", material: "塑料与金属结合、皮革、有屏幕的电子科技物", color: "赤红色、亮紫色、粉红色", space: "宜在明亮处、发热电器旁、书桌上或皮包内", bestGuess: "手机", candidates: ["充电宝", "打火机", "眼镜", "精美卡片"] },
  3: { name: "震雷", symbol: "☳", element: "wood", elementName: "木", shape: "细长条状，或具有弹性，容易发生震动/响声", material: "竹木材质、多股线缆缠绕、韧性材料", color: "青绿色、木本色、深绿色", space: "宜在经常移动处、门侧、电视或音响附近", bestGuess: "充电线", candidates: ["签字笔", "木梳", "牙刷", "小盆栽"] },
  4: { name: "巽风", symbol: "☴", element: "wood", elementName: "木", shape: "轻薄纤细，能飘动折叠，或散发淡淡清香", material: "纸质、皮革、轻质纤维物、羽毛", color: "草绿色、粉白色、浅淡色彩", space: "宜在通风口、抽屉夹层、窗台或书架深处", bestGuess: "书本", candidates: ["便签纸", "湿纸巾", "香水瓶", "棉质发带"] },
  5: { name: "坎水", symbol: "☵", element: "water", elementName: "水", shape: "中间凹陷下垂，或者属于中空容器、弯曲流线", material: "流质液体、玻璃、透明树脂、中空塑料", color: "纯黑色、深蓝色、墨绿色", space: "宜在潮湿水源处、茶几下、阴暗角落或有遮挡物下", bestGuess: "水杯", candidates: ["饮料瓶", "眼药水", "墨水瓶", "清洁湿巾"] },
  6: { name: "艮山", symbol: "☶", element: "earth", elementName: "土", shape: "块状结构，坚固沉重，不易变形，静止不动", material: "陶瓷、石材、粘土烧制、厚重皮革", color: "土黄色、褐色、深咖啡色", space: "宜在固定不动的低台、床头柜上或柜子底部", bestGuess: "陶瓷杯", candidates: ["钱包", "石头摆件", "金属钥匙包", "茶宠印章"] },
  7: { name: "坤地", symbol: "☷", element: "earth", elementName: "土", shape: "平整而厚实，容量较大能承载，多为方形", material: "布料、棉麻编织、软质塑料、承载力强的材料", color: "姜黄色、深灰色、土黑色", space: "宜在地面上、抽屉底层、衣柜里或桌垫下方", bestGuess: "收纳盒", candidates: ["布提袋", "抽纸盒", "鼠标垫", "笔记本手记"] }
}

const initShefuStats = () => {
  const saved = localStorage.getItem('happylife_shefu_stats')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      shefuStats.total = parsed.total || 0
      shefuStats.hits = parsed.hits || 0
      shefuStats.rate = shefuStats.total > 0 ? Math.round((shefuStats.hits / shefuStats.total) * 100) : 0
    } catch (e) {
      console.log(e)
    }
  }
}

const saveShefuStats = () => {
  localStorage.setItem('happylife_shefu_stats', JSON.stringify({
    total: shefuStats.total,
    hits: shefuStats.hits
  }))
}

const generateRandomNumbers = () => {
  shefuForm.num1 = Math.floor(Math.random() * 100) + 1
  shefuForm.num2 = Math.floor(Math.random() * 100) + 1
  shefuForm.num3 = Math.floor(Math.random() * 100) + 1
  ElMessage.success('已从天地间凝聚三个随机感应数！')
}

const startShefu = () => {
  if (shefuForm.num1 <= 0 || shefuForm.num2 <= 0 || shefuForm.num3 <= 0) {
    ElMessage.warning('感应数必须是大于 0 的整数！')
    return
  }

  shefuLoading.value = true
  shefuResultVisible.value = false
  feedbackGiven.value = false
  shefuHit.value = false
  realItemSubmitted.value = false
  realItemName.value = ''

  setTimeout(() => {
    const sumVal = Number(shefuForm.num1) + Number(shefuForm.num2) + Number(shefuForm.num3)
    const finalIndex = sumVal % 8
    const 卦象 = shefuDatabase[finalIndex]

    shefuResult.value = 卦象
    shefuLoading.value = false
    shefuResultVisible.value = true
  }, 1500)
}

const submitFeedback = (isHit) => {
  feedbackGiven.value = true
  shefuHit.value = isHit
  
  shefuStats.total++
  if (isHit) {
    shefuStats.hits++
  }
  shefuStats.rate = Math.round((shefuStats.hits / shefuStats.total) * 100)
  saveShefuStats()
}

const submitRealItem = () => {
  if (!realItemName.value || !realItemName.value.trim()) {
    ElMessage.warning('请输入物品真实名称！')
    return
  }
  realItemSubmitted.value = true
  ElMessage.info('已记录您的真实物品，天地数理感应修正中...')
}

const getShefuReflection = () => {
  const item = realItemName.value.trim()
  if (!item) return '数理感应微调中...'
  return `您脑海中所想之物是「${item}」，其物理场能与此次演算的「${shefuResult.value.bestGuess}」发生法理交叉。下次输入数字前请凝神静气，排除杂念。`
}

const resetShefuGame = () => {
  shefuResultVisible.value = false
  shefuResult.value = null
  feedbackGiven.value = false
  shefuHit.value = false
  realItemSubmitted.value = false
  realItemName.value = ''
}

// ==========================================
// 自动高亮与生命周期联动
// ==========================================
onMounted(() => {
  initShefuStats()
  
  // 检查是否需要默认定位子页签
  const redirectSubTab = localStorage.getItem('happylife_redirect_sub_tab')
  if (redirectSubTab) {
    activeDeduceTab.value = redirectSubTab
    localStorage.removeItem('happylife_redirect_sub_tab')
  }

  // 监听来自全局的 change-sub-tab 事件
  window.addEventListener('change-sub-tab', handleSubTabRedirect)
})

onUnmounted(() => {
  window.removeEventListener('change-sub-tab', handleSubTabRedirect)
})

const handleSubTabRedirect = (e) => {
  if (e.detail) {
    activeDeduceTab.value = e.detail
  }
}
</script>

<style scoped>
/* 由于这个组件庞大，这里包含该模块以及寻物/射覆独有的样式 */

.glass-card { border-radius: 24px; background: rgba(255, 255, 255, 0.75) !important; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.05); padding: 24px; position: relative; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.glass-card:hover { transform: translateY(-2px); box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08); }
.card-glow-title { font-size: 16px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 15px; }
.glow-icon { color: #6366f1; font-size: 18px; }
.table-intro { font-size: 13px; color: #64748b; margin-bottom: 20px; background: #f8fafc; padding: 10px 18px; border-radius: 10px; border-left: 3px solid #cbd5e1; }
.tab-label-custom { display: flex; align-items: center; gap: 8px; font-weight: 700; }
.plum-main-container { margin-top: 24px; }
.plum-console-col { margin-bottom: 20px; }
.plum-console-card { background: rgba(255, 255, 255, 0.85) !important; border: 1px solid rgba(99, 102, 241, 0.15) !important; box-shadow: 0 12px 36px rgba(99, 102, 241, 0.06) !important; border-radius: 24px; display: flex; flex-direction: column; }
.deduce-action-center { display: flex; justify-content: center; margin-top: auto; padding-top: 24px; }
.analysis-inner-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; }
.actor-circle-glow { width: 80px; height: 80px; border-radius: 50%; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(0,0,0,0.04); transition: all 0.3s ease; }
.actor-symbol { font-size: 28px; font-weight: 800; line-height: 1; transition: all 0.3s ease; }
.actor-name { font-size: 14px; font-weight: 800; color: #1e293b; margin: 2px 0 0 0; transition: all 0.3s ease; }
.relation-link-arrow { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100px; position: relative; margin: 0 10px; transition: all 0.3s ease; }
.hexagram-card { border-radius: 24px; padding: 24px; display: flex; flex-direction: column; align-items: center; background: rgba(255, 255, 255, 0.8) !important; transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) !important; border: 1px solid rgba(0, 0, 0, 0.05) !important; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02) !important; }
.hexagram-card:hover { transform: translateY(-4px); box-shadow: 0 20px 45px rgba(0, 0, 0, 0.06) !important; border-color: rgba(99, 102, 241, 0.15) !important; }
.hex-lines-container { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 160px; height: 120px; justify-content: space-between; margin-bottom: 20px; position: relative; transition: all 0.3s ease; }
.yao-label-tag { position: absolute; right: -55px; font-size: 10px; color: #94a3b8; font-weight: 700; transition: all 0.3s ease; }
.moving-dot { position: absolute; left: -50px; font-size: 10px; font-weight: 800; color: #b45309; animation: pulseGlow 1.5s infinite; transition: all 0.3s ease; }
.change-dot { position: absolute; left: -50px; font-size: 10px; font-weight: 800; color: #059669; animation: pulseGlow 1.5s infinite; transition: all 0.3s ease; }
.hex-desc { transition: color 0.3s; }
.hexagram-card:hover .hex-desc { color: #334155 !important; }
.custom-radio-group { background: rgba(0, 0, 0, 0.03); padding: 6px; border-radius: 16px; border: 1px solid rgba(0, 0, 0, 0.02); }
.custom-radio-group :deep(.el-radio-button__inner) { border-radius: 12px !important; margin: 0 4px; border: 1px solid transparent !important; background: transparent !important; color: #64748b !important; font-weight: bold; font-size: 13px; padding: 8px 20px; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); box-shadow: none !important; }
.custom-radio-group :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) { background: linear-gradient(135deg, #1e1b4b, #4c1d95) !important; color: #fbbf24 !important; border-color: rgba(251, 191, 36, 0.15) !important; box-shadow: 0 4px 15px rgba(30, 27, 75, 0.25) !important; }
.magic-btn { border-radius: 12px !important; }
.plum-deduce-big-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(76, 29, 149, 0.35) !important; filter: brightness(1.08); }
.plum-deduce-big-btn:active { transform: translateY(0); }
.spinning-fast { animation: spinTaiji 1.2s linear infinite !important; }

@keyframes spinTaiji { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes loadProgress { 0% { transform: scaleX(0); } 50% { transform: scaleX(0.7); } 100% { transform: scaleX(1); } }
@keyframes pulseGlow { 0%, 100% { opacity: 0.8; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1.02); } }

/* ==========================================
   梅花寻物 & 射覆模块独有 CSS
   ========================================== */
.form-card { border-radius: 20px; }
.submit-btn { height: 50px; font-size: 1.1rem; border-radius: 12px; }
.w-full { width: 100%; }

.tips-panel { background: rgba(99, 102, 241, 0.05); border-left: 4px solid #6366f1; padding: 15px; border-radius: 0 12px 12px 0; text-align: left; }
.tips-title { display: flex; align-items: center; gap: 6px; font-weight: 600; color: #4f46e5; margin-bottom: 8px; font-size: 0.95rem; }
.tips-panel ul { padding-left: 18px; margin: 0; }
.tips-panel li { font-size: 0.85rem; color: #475569; line-height: 1.6; margin-bottom: 4px; }

.empty-card, .loading-card { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 480px; padding: 40px; border-radius: 20px; }
.crystal-ball-wrapper { margin-bottom: 30px; }
.crystal-ball { position: relative; width: 120px; height: 120px; background: radial-gradient(circle at 30% 30%, #a855f7 0%, #6366f1 70%, #4f46e5 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(99, 102, 241, 0.5), inset 0 -10px 20px rgba(0, 0, 0, 0.3); animation: float 4s ease-in-out infinite; }
.yin-yang-mark { font-size: 3.5rem; color: rgba(255, 255, 255, 0.85); text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
.glow-effect { position: absolute; top: 10%; left: 15%; width: 30px; height: 15px; background: rgba(255, 255, 255, 0.5); border-radius: 50%; transform: rotate(-30deg); filter: blur(2px); }
.status-title { font-size: 1.6rem; font-weight: 800; color: #1e293b; margin-bottom: 12px; }
.status-desc { font-size: 0.95rem; color: #64748b; line-height: 1.6; }

.bagua-loader { position: relative; width: 140px; height: 140px; margin-bottom: 30px; }
.bagua-outer { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 1px dashed rgba(99, 102, 241, 0.4); animation: rotate-clockwise 20s linear infinite; }
.trigram { position: absolute; font-size: 1.3rem; font-weight: 600; color: #6366f1; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
.trigram:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); }
.trigram:nth-child(2) { top: 15%; left: 85%; transform: translate(-50%, -50%); }
.trigram:nth-child(3) { top: 50%; left: 100%; transform: translate(-100%, -50%); }
.trigram:nth-child(4) { top: 85%; left: 85%; transform: translate(-50%, -50%); }
.trigram:nth-child(5) { top: 100%; left: 50%; transform: translate(-50%, -100%); }
.trigram:nth-child(6) { top: 85%; left: 15%; transform: translate(-50%, -50%); }
.trigram:nth-child(7) { top: 50%; left: 0; transform: translate(0, -50%); }
.trigram:nth-child(8) { top: 15%; left: 15%; transform: translate(-50%, -50%); }
.bagua-inner { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem; color: #6366f1; text-shadow: 0 0 15px rgba(99, 102, 241, 0.4); animation: pulse-spin 3s ease-in-out infinite; }

.scanning { background: linear-gradient(to right, #6366f1, #a855f7, #6366f1); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 2s linear infinite; }

.greeting-banner { display: flex; align-items: center; gap: 15px; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 16px 20px; border-radius: 16px; color: white; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.15); text-align: left; }
.avatar-box { font-size: 2.2rem; background: rgba(255, 255, 255, 0.2); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px; backdrop-filter: blur(5px); }
.greeting-text h4 { margin: 0; font-size: 0.95rem; font-weight: 500; opacity: 0.9; }
.greeting-text p { margin: 2px 0 0 0; font-size: 1.15rem; font-weight: 700; }

.hexagram-main { display: flex; align-items: center; gap: 25px; padding-bottom: 20px; border-bottom: 1px solid rgba(226, 232, 240, 0.6); width: 100%; text-align: left; }
.hexagram-symbol-box { background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 16px; width: 80px; height: 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; }
.hexagram-symbol-box .symbol { font-size: 2.8rem; line-height: 1; color: #4f46e5; }
.hexagram-symbol-box .symbol-name { font-size: 0.8rem; font-weight: 600; color: #6366f1; margin-top: 2px; }
.hexagram-meta { flex: 1; }
.meta-title { font-size: 1.3rem; font-weight: 800; color: #1e293b; margin-bottom: 10px; }
.badge-row { display: flex; flex-wrap: wrap; gap: 8px; }
.rounded-tag { border-radius: 8px; font-weight: 600; font-size: 0.8rem; border: none; }

.hexagram-details { display: flex; flex-direction: column; gap: 15px; padding-top: 20px; text-align: left; }
.detail-item h5 { font-size: 0.9rem; font-weight: 700; color: #4f46e5; margin-bottom: 5px; display: flex; align-items: center; gap: 6px; }
.detail-item p { font-size: 0.9rem; color: #334155; line-height: 1.5; margin: 0; }

.situational-advice { position: relative; background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.1); padding: 16px; border-radius: 16px; text-align: left; }
.bubble-triangle { position: absolute; top: -10px; left: 30px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 10px solid rgba(99, 102, 241, 0.05); }
.advice-content { font-size: 1rem; color: #1e293b; line-height: 1.6; margin: 0 0 8px 0; }
.encouragement-content { font-size: 0.95rem; color: #059669; font-weight: 600; margin: 0; }

.glass-collapse :deep(.el-collapse-item__header) { background: rgba(255, 255, 255, 0.5) !important; border: 1px solid rgba(226, 232, 240, 0.6) !important; border-radius: 12px; padding: 0 15px; height: 48px; font-weight: 600; color: #475569; transition: all 0.3s; }
.glass-collapse :deep(.el-collapse-item__wrap) { background: transparent !important; border: none !important; }
.glass-collapse :deep(.el-collapse-item__content) { padding: 15px 10px 0 10px; }
.collapse-header { display: flex; align-items: center; gap: 8px; }
.calculation-process { background: rgba(248, 250, 252, 0.7); border: 1px solid rgba(226, 232, 240, 0.8); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 15px; text-align: left; }
.step-item h6 { font-size: 0.9rem; font-weight: 700; color: #475569; margin-bottom: 6px; }
.step-content { background: white; border: 1px solid #f1f5f9; border-radius: 8px; padding: 10px 12px; font-size: 0.85rem; color: #475569; }
.step-content p { margin: 0 0 5px 0; }
.step-content p:last-child { margin: 0; }
.code-font { font-family: monospace, sans-serif; }

.action-buttons { display: flex; gap: 15px; justify-content: center; }
.action-btn { padding: 12px 24px !important; font-size: 0.95rem !important; border-radius: 12px !important; }

/* 射覆猜物样式 */
.secret-intro h4 { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
.secret-intro p { font-size: 0.85rem; color: #64748b; line-height: 1.5; margin-bottom: 15px; }
.flex-buttons { display: flex; gap: 10px; }
.flex-buttons button { padding: 10px 15px !important; font-size: 0.85rem !important; border-radius: 8px !important; height: 40px !important; }
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }
.score-board { font-size: 0.85rem; color: #64748b; display: flex; align-items: center; gap: 6px; }
.score-num { font-size: 1rem; font-weight: 700; }
.text-success { color: #10b981; }
.text-primary { color: #6366f1; }

.shefu-placeholder, .shefu-loading-box { min-height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(248, 250, 252, 0.5); border: 1px dashed rgba(226, 232, 240, 0.8); border-radius: 16px; padding: 20px; color: #64748b; font-size: 0.85rem; line-height: 1.6; }
.divination-disc { font-size: 3.5rem; color: #94a3b8; }
.yin-yang-spinner { font-size: 3.5rem; color: #6366f1; animation: rotate-clockwise 2s linear infinite; }
.animate-spin-slow { animation: rotate-clockwise 15s linear infinite; }

.shefu-result-box { background: white; border: 1px solid rgba(226, 232, 240, 0.8); border-radius: 16px; padding: 20px; text-align: left; }
.shefu-header { display: flex; align-items: center; gap: 15px; }
.shefu-symbol { font-size: 2.2rem; color: #6366f1; background: rgba(99, 102, 241, 0.08); width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
.shefu-title h4 { margin: 0; font-size: 1.05rem; font-weight: 800; color: #1e293b; }
.shefu-title p { margin: 4px 0 0 0; font-size: 0.85rem; color: #64748b; display: flex; align-items: center; gap: 6px; }

.properties-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.prop-card { background: rgba(248, 250, 252, 0.7); border: 1px solid #f1f5f9; padding: 8px 12px; border-radius: 10px; display: flex; flex-direction: column; }
.prop-label { font-size: 0.72rem; font-weight: 600; color: #94a3b8; margin-bottom: 2px; }
.prop-val { font-size: 0.85rem; font-weight: 700; color: #334155; }

.guessing-verdict { background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%); border: 1px solid #fde68a; border-radius: 12px; padding: 16px; text-align: center; }
.verdict-lead { font-size: 0.85rem; color: #b45309; margin: 0 0 6px 0; font-weight: 600; }
.verdict-main { font-size: 1.6rem; font-weight: 800; color: #d97706; text-shadow: 0 1px 2px rgba(0,0,0,0.05); margin-bottom: 8px; }
.verdict-candidates { font-size: 0.8rem; color: #b45309; margin: 0; display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; }
.candidate-tag { background: rgba(217, 119, 6, 0.1); padding: 1px 6px; border-radius: 4px; font-weight: 600; }

.feedback-action-box { border-top: 1px solid #f1f5f9; padding-top: 15px; text-align: center; }
.feedback-title { font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 10px; }
.feedback-result-panel { border-top: 1px solid #f1f5f9; padding: 12px; border-radius: 10px; text-align: left; }
.feedback-result-panel.panel-success { background-color: rgba(16, 185, 129, 0.04); border: 1px solid rgba(16, 185, 129, 0.08); }
.feedback-result-panel.panel-fail { background-color: rgba(217, 119, 6, 0.03); border: 1px solid rgba(217, 119, 6, 0.06); }
.feedback-result-panel h5 { font-size: 0.95rem; font-weight: 800; margin-top: 0; margin-bottom: 4px; }
.panel-success h5 { color: #059669; }
.panel-fail h5 { color: #b45309; }
.feedback-result-panel p { font-size: 0.85rem; color: #475569; margin: 0; line-height: 1.5; }
.reflection-text { font-style: italic; color: #7c2d12 !important; background: rgba(217, 119, 6, 0.04); padding: 6px 10px; border-radius: 6px; margin-top: 4px !important; font-size: 0.8rem !important; }

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
@keyframes rotate-clockwise {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes pulse-spin {
  0% { transform: translate(-50%, -50%) rotate(0deg) scale(0.95); opacity: 0.8; }
  50% { transform: translate(-50%, -50%) rotate(-180deg) scale(1.05); opacity: 1; }
  100% { transform: translate(-50%, -50%) rotate(-360deg) scale(0.95); opacity: 0.8; }
}
@keyframes shine {
  to { background-position: 200% center; }
}

@media (max-width: 992px) {
  .plum-console-col { margin-bottom: 0 !important; }
  .plum-main-container > .el-row { display: flex !important; align-items: stretch !important; }
  .plum-main-container > .el-row > .el-col { display: flex !important; flex-direction: column !important; }
  .plum-display-section { height: 100% !important; display: flex !important; flex-direction: column !important; }
  .plum-empty-card, .plum-loading-card { flex: 1 !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; height: 100% !important; }
  .hexagram-card { padding: 24px 12px !important; }
  .hex-lines-container { max-width: 110px !important; }
  .yao-label-tag { right: -38px !important; }
  .moving-dot, .change-dot { left: -38px !important; }
  .analysis-inner-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
}

@media (max-width: 768px) {
  .plum-display-section { margin-top: 20px !important; }
  .actor-circle-glow { width: 68px !important; height: 68px !important; }
  .actor-symbol { font-size: 22px !important; }
  .actor-name { font-size: 12px !important; }
  .relation-link-arrow { width: 60px !important; margin: 0 5px !important; }
  .arrow-relation-badge { font-size: 9.5px !important; padding: 2px 6px !important; }
  .empty-card, .loading-card { min-height: 350px; padding: 20px; }
  .hexagram-main { flex-direction: column; align-items: center; text-align: center; gap: 15px; }
  .action-buttons { flex-direction: column; gap: 10px; }
  .action-btn { width: 100%; }
  .properties-grid { grid-template-columns: 1fr; }
  .score-board { flex-wrap: wrap; gap: 4px; margin-top: 8px; }
}

/* 等高卡片通用支持 */
.bazi-input-card {
  background: rgba(255, 255, 255, 0.4) !important;
  border-radius: 24px !important;
  padding: 24px !important;
  border: 1px solid rgba(0, 0, 0, 0.02) !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
}
.bazi-placeholder {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 60px 40px !important;
  border: 1px dashed rgba(99, 102, 241, 0.25) !important;
  border-radius: 24px !important;
  background: rgba(255, 255, 255, 0.6) !important;
  min-height: 250px !important;
  text-align: center !important;
}
.bazi-loading {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 60px 40px !important;
  border-radius: 24px !important;
  min-height: 250px !important;
  text-align: center !important;
  background: rgba(255, 255, 255, 0.6) !important;
  border: 1px solid rgba(0, 0, 0, 0.02) !important;
}
.bazi-result-board {
  display: flex !important;
  flex-direction: column !important;
  gap: 16px !important;
}

@media (min-width: 993px) {
  /* 并排时等高处理 */
  .deduce-main-row,
  .guess-tab-row {
    display: flex !important;
    align-items: stretch !important;
  }
  .deduce-main-row > .el-col,
  .guess-tab-row > .el-col {
    display: flex !important;
    flex-direction: column !important;
  }
  
  /* 确保直接子级组件占满高度 */
  .deduce-main-row > .el-col > .glass-card,
  .deduce-main-row > .el-col > .plum-display-section,
  .deduce-main-row > .el-col > .bazi-result-board,
  .guess-tab-row > .el-col > .shefu-form-card,
  .guess-tab-row > .el-col > .shefu-placeholder,
  .guess-tab-row > .el-col > .shefu-loading-box,
  .guess-tab-row > .el-col > .shefu-result-box {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
  }

  /* 二级状态框也要撑满 */
  .plum-display-section > .glass-card,
  .plum-display-section > .plum-result-board,
  .bazi-result-board > div {
    flex: 1 !important;
  }
}
</style>
