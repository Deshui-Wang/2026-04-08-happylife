<template>
  <div class="practice-dictionary animate-fade-in">
    <!-- 1. 玄学修行页眉 -->
    <div class="spiritual-header glass-card">
      <div class="header-overlay"></div>
      <div class="header-info">
        <div class="title-wrap">
          <span class="taiji-icon">☯</span>
          <h2 class="section-title">修行字典</h2>
        </div>
        <p class="section-subtitle">
          天干地支 · 先天八卦 · 探寻万物互联的宇宙常数编码
        </p>
      </div>
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索地支、生肖、五行、八卦或意象..."
          class="custom-search"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 2. 首屏交互面板：时辰地支实时换算与梅花易数全息起卦 -->
    <el-row :gutter="24" class="control-row">
      <!-- 上半部分：时辰地支实时换算 -->
      <el-col :xs="24" :span="24" class="flex-column" style="margin-bottom: 24px;">
        <div class="glass-card calculator-card">
          <div class="card-glow-title">
            <el-icon class="glow-icon"><Clock /></el-icon>
            <span>时辰 / 地支 实时换算与推演</span>
          </div>

          <div class="calculator-inner">
            <el-row :gutter="24">
              <!-- 左侧：时间与模拟 -->
              <el-col :xs="24" :md="12">
                <div class="live-clock-section" style="display: flex; flex-direction: column; gap: 15px; height: 100%;">
                  <!-- 左侧合并卡片 -->
                  <div class="clock-display combined-clock-card" style="margin: 0; width: 100%; box-sizing: border-box;">
                    <span class="time-num">
                      {{ liveTime }}<span class="branch-paren"><!-- -->{{ currentBranchInfo.name }}时)</span>
                    </span>
                    <span class="time-label">现代时间 (对应地支时辰)</span>
                  </div>
                  <!-- 右侧模拟卡片 -->
                  <div class="branch-display simulation-control-card" style="margin: 0; width: 100%; box-sizing: border-box; flex: 1;">
                    <div class="sim-header-row">
                      <span class="sim-title">手动模拟一天时间</span>
                      <el-button
                        type="success"
                        size="small"
                        :plain="!isAutoTime"
                        class="sync-btn-compact"
                        @click="resumeAutoTime"
                      >
                        同步实时
                      </el-button>
                    </div>
                    <div class="sim-body-row">
                      <el-input-number
                        v-model="simulatedHour"
                        :min="0"
                        :max="23"
                        :step="1"
                        size="default"
                        class="simulation-input-field"
                        @change="isAutoTime = false"
                      />
                      <span class="sim-unit-text">点 (24时制)</span>
                    </div>
                  </div>
                </div>
              </el-col>

              <!-- 右侧：详细解读 -->
              <el-col :xs="24" :md="12">
                <div class="branch-detail-panel" :class="simulatedBranchInfo.element" style="height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
                  <div class="detail-badge-row">
                    <el-tag effect="dark" :class="'element-tag ' + simulatedBranchInfo.element">
                      五行：{{ simulatedBranchInfo.elementName }}
                    </el-tag>
                    <el-tag type="info" effect="plain" style="color: #475569; border-color: #cbd5e1;">
                      农历月份：{{ simulatedBranchInfo.month }}
                    </el-tag>
                    <el-tag type="warning" effect="dark" class="id-badge">
                      ID: {{ simulatedBranchInfo.id }}
                    </el-tag>
                  </div>

                  <div class="detail-content" style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 15px; margin-top: 10px; margin-bottom: 10px;">
                    <div class="main-info">
                      <span class="zodiac-pic">{{ simulatedBranchInfo.zodiacEmoji }}</span>
                      <div class="info-text">
                        <h3 style="margin: 0; font-size: 18px;">
                          {{ simulatedBranchInfo.name }} ({{ simulatedBranchInfo.pinyin }}) · {{ simulatedBranchInfo.zodiac }}
                        </h3>
                        <p class="modern-time" style="margin: 5px 0 0 0;">时间段：{{ simulatedBranchInfo.timeSpan }}</p>
                      </div>
                    </div>
                    <div class="rhyme-box" style="margin: 0;">
                      <span class="quote-mark">“</span>
                      <span class="rhyme-text">{{ simulatedBranchInfo.rhyme }}</span>
                      <span class="quote-mark">”</span>
                    </div>
                  </div>

                  <!-- 换日点警告提示 -->
                  <transition name="el-zoom-in-top">
                    <div v-if="simulatedHour === 23" class="midnight-warning" style="margin-top: 10px; margin-bottom: 0;">
                      <el-icon><WarningFilled /></el-icon>
                      <span style="font-size: 12px;"><strong>⚠️ 换日点：</strong>在周易系统中，子时（23:00）一到，就已经切换到第二天了。</span>
                    </div>
                  </transition>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>

      <!-- 下半部分：梅花易数全息起卦推演平台 -->
      <el-col :xs="24" :span="24" class="flex-column">
        <div class="glass-card plum-card" style="display: flex; flex-direction: column; margin-bottom: 24px;">
          <div class="card-glow-title">
            <div style="display: flex; align-items: center; gap: 10px;">
              <el-icon class="glow-icon"><Opportunity /></el-icon>
              <span>梅花易数全息起卦推演</span>
            </div>
          </div>
          
          <div class="table-intro" style="margin: 15px 24px 10px 24px; font-size: 13px; color: #64748b; background: #f8fafc; padding: 10px 18px; border-radius: 10px; border-left: 3px solid #cbd5e1;">
            根据“数由心生、万物皆数”的法则，通过特定时间或数字输入来起卦，解算出本卦、互卦和变卦，研判体用生克。
          </div>

          <div class="plum-main-container" style="flex: 1; padding: 0 24px 24px 24px; overflow-y: auto;">
            <el-row :gutter="24">
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
                      <el-option
                        v-for="item in lunarYearOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
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
                      <el-option
                        v-for="item in lunarHourOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
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
                      
                      <!-- 卦爻排盘（从上到下，即从6爻到1爻） -->
                      <div class="hex-lines-container">
                        <div
                          v-for="index in [5, 4, 3, 2, 1, 0]"
                          :key="'ben-yao-' + index"
                          class="hex-yao-line"
                          :style="{ position: 'relative', width: '100%', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }"
                        >
                          <!-- 阳爻 [1] -->
                          <div v-if="plumResult.ben.yao[index] === 1" class="yao-bar yang-bar" :style="{ width: '100%', height: '8px', background: (index + 1) === plumResult.movingYao ? 'linear-gradient(90deg, #d97706, #fbbf24)' : '#334155', borderRadius: '4px', boxShadow: (index + 1) === plumResult.movingYao ? '0 0 10px rgba(251, 191, 36, 0.6)' : 'none' }"></div>
                          <!-- 阴爻 [0] -->
                          <div v-else class="yao-bar yin-bar" :style="{ width: '100%', height: '8px', display: 'flex', justifyContent: 'space-between' }">
                            <div class="yin-half left-half" :style="{ width: '45%', height: '100%', background: (index + 1) === plumResult.movingYao ? 'linear-gradient(90deg, #d97706, #fbbf24)' : '#334155', borderRadius: '4px', boxShadow: (index + 1) === plumResult.movingYao ? '0 0 10px rgba(251, 191, 36, 0.6)' : 'none' }"></div>
                            <div class="yin-half right-half" :style="{ width: '45%', height: '100%', background: (index + 1) === plumResult.movingYao ? 'linear-gradient(90deg, #fbbf24, #d97706)' : '#334155', borderRadius: '4px', boxShadow: (index + 1) === plumResult.movingYao ? '0 0 10px rgba(251, 191, 36, 0.6)' : 'none' }"></div>
                          </div>
                          
                          <!-- 爻位右侧小圆点及说明 -->
                          <span class="yao-label-tag">{{ getClerkYaoName(index + 1) }}</span>
                          <span v-if="(index + 1) === plumResult.movingYao" class="moving-dot">○ 动爻</span>
                        </div>
                      </div>

                      <div class="hex-gua-meta" style="text-align: center; width: 100%; margin-top: 10px;">
                        <h2 style="font-size: 22px; font-weight: 800; color: #1e293b; margin: 0 0 8px 0;">{{ plumResult.ben.name }}</h2>
                        <div class="hex-tag-row" style="display: flex; gap: 8px; justify-content: center; margin-bottom: 12px;">
                          <el-tag size="small" type="warning" effect="dark" style="border: none;">
                            {{ plumResult.ben.upGua.name }}天 / {{ plumResult.ben.downGua.name }}地
                          </el-tag>
                          <el-tag size="small" type="danger" effect="plain" style="border-radius: 6px; font-weight: bold;">
                            {{ plumResult.isTiUp ? '上体下用' : '下体上用' }}
                          </el-tag>
                        </div>
                        <p class="hex-desc" style="font-size: 12px; color: #64748b; line-height: 1.5; background: #f8fafc; padding: 10px; border-radius: 10px; min-height: 54px; margin: 0;">{{ plumResult.ben.desc }}</p>
                      </div>
                    </div>
                  </el-col>

                  <!-- 互卦 -->
                  <el-col :xs="24" :md="8" style="margin-bottom: 20px;">
                    <div class="glass-card hexagram-card hu-card">
                      <div class="hex-badge" style="background: rgba(148, 163, 184, 0.1); color: #475569; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px;">互卦 · 核心与中途</div>
                      
                      <!-- 卦爻排盘 -->
                      <div class="hex-lines-container">
                        <div
                          v-for="index in [5, 4, 3, 2, 1, 0]"
                          :key="'hu-yao-' + index"
                          class="hex-yao-line"
                          :style="{ position: 'relative', width: '100%', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }"
                        >
                          <!-- 阳爻 [1] -->
                          <div v-if="plumResult.hu.yao[index] === 1" class="yao-bar yang-bar" style="width: 100%; height: 8px; background: #475569; border-radius: 4px;"></div>
                          <!-- 阴爻 [0] -->
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
                          <el-tag size="small" type="info" effect="dark" style="border: none;">
                            {{ plumResult.hu.upGua.name }}天 / {{ plumResult.hu.downGua.name }}地
                          </el-tag>
                        </div>
                        <p class="hex-desc" style="font-size: 12px; color: #64748b; line-height: 1.5; background: #f8fafc; padding: 10px; border-radius: 10px; min-height: 54px; margin: 0;">{{ plumResult.hu.desc }}</p>
                      </div>
                    </div>
                  </el-col>

                  <!-- 变卦 -->
                  <el-col :xs="24" :md="8" style="margin-bottom: 20px;">
                    <div class="glass-card hexagram-card bian-card">
                      <div class="hex-badge" style="background: rgba(16, 185, 129, 0.1); color: #059669; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px;">变卦 · 结果与终局</div>
                      
                      <!-- 卦爻排盘 -->
                      <div class="hex-lines-container">
                        <div
                          v-for="index in [5, 4, 3, 2, 1, 0]"
                          :key="'bian-yao-' + index"
                          class="hex-yao-line"
                          :style="{ position: 'relative', width: '100%', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }"
                        >
                          <!-- 阳爻 [1] -->
                          <div v-if="plumResult.bian.yao[index] === 1" class="yao-bar yang-bar" :style="{ width: '100%', height: '8px', background: (index + 1) === plumResult.movingYao ? 'linear-gradient(90deg, #10b981, #34d399)' : '#334155', borderRadius: '4px', boxShadow: (index + 1) === plumResult.movingYao ? '0 0 10px rgba(16, 185, 129, 0.6)' : 'none' }"></div>
                          <!-- 阴爻 [0] -->
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
                          <el-tag size="small" type="success" effect="dark" style="border: none;">
                            {{ plumResult.bian.upGua.name }}天 / {{ plumResult.bian.downGua.name }}地
                          </el-tag>
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
                    <!-- 左侧：生克对比看板 -->
                    <div class="relation-board-box" style="background: #f8fafc; border-radius: 20px; padding: 24px; border: 1px solid rgba(0,0,0,0.02); display: flex; justify-content: space-around; align-items: center; position: relative;">
                      <!-- 体卦 -->
                      <div class="relation-actor ti-actor" style="display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 1;">
                        <span class="actor-tag" style="font-size: 11px; font-weight: 800; color: #4f46e5; background: rgba(99,102,241,0.1); padding: 2px 8px; border-radius: 10px;">体卦 (主)</span>
                        <div class="actor-circle-glow" :style="{ border: '3px solid ' + plumResult.tiGua.color }">
                          <span class="actor-symbol" :style="{ color: plumResult.tiGua.color }">{{ plumResult.tiGua.symbol }}</span>
                          <h4 class="actor-name">{{ plumResult.tiGua.name }}卦</h4>
                        </div>
                        <el-tag effect="dark" size="small" :color="plumResult.tiGua.color" style="border:none; font-weight: 800;">
                          {{ plumResult.tiGua.element }} ({{ plumResult.tiGua.nature }})
                        </el-tag>
                      </div>

                      <!-- 关联箭头 -->
                      <div class="relation-link-arrow">
                        <div class="arrow-relation-badge" style="background: linear-gradient(135deg, #1e1b4b, #311042); color: #fbbf24; font-weight: 900; padding: 4px 10px; border-radius: 10px; text-shadow: 0 1px 2px rgba(0,0,0,0.2); box-shadow: 0 4px 10px rgba(0,0,0,0.15); z-index: 2; white-space: nowrap;">
                          {{ plumResult.relation }}
                        </div>
                        <div class="arrow-visual-line" style="width: 100%; height: 2px; border-bottom: 2px dashed #cbd5e1; position: absolute; top: 12px; left: 0;"></div>
                        <!-- 指向箭头的动态方向小尖角 -->
                        <div class="arrow-direction-marker" style="position: absolute; top: 8px; font-size: 12px; color: #94a3b8;" :style="plumResult.relation === '用生体' ? { left: '15px' } : plumResult.relation === '体生用' || plumResult.relation === '体克用' ? { right: '15px' } : { display: 'none' }">
                          {{ plumResult.relation === '用生体' ? '◀' : '▶' }}
                        </div>
                      </div>

                      <!-- 用卦 -->
                      <div class="relation-actor yong-actor" style="display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 1;">
                        <span class="actor-tag" style="font-size: 11px; font-weight: 800; color: #b45309; background: rgba(245,158,11,0.1); padding: 2px 8px; border-radius: 10px;">用卦 (事/客)</span>
                        <div class="actor-circle-glow" :style="{ border: '3px solid ' + plumResult.yongGua.color }">
                          <span class="actor-symbol" :style="{ color: plumResult.yongGua.color }">{{ plumResult.yongGua.symbol }}</span>
                          <h4 class="actor-name">{{ plumResult.yongGua.name }}卦</h4>
                        </div>
                        <el-tag effect="dark" size="small" :color="plumResult.yongGua.color" style="border:none; font-weight: 800;">
                          {{ plumResult.yongGua.element }} ({{ plumResult.yongGua.nature }})
                        </el-tag>
                      </div>
                    </div>

                    <!-- 右侧：谶语吉凶解析 -->
                    <div class="relation-luck-box" :class="getLuckClass(plumResult.luckLevel)" style="border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 14px; justify-content: center; transition: all 0.3s;" :style="{ borderLeft: '6px solid ' + (plumResult.luckLevel.includes('大吉') ? '#f59e0b' : plumResult.luckLevel.includes('吉') ? '#10b981' : plumResult.luckLevel.includes('大凶') ? '#ef4444' : plumResult.luckLevel.includes('凶') ? '#f43f5e' : '#64748b'), background: plumResult.luckLevel.includes('大吉') ? '#fffdf5' : plumResult.luckLevel.includes('大凶') ? '#fff5f5' : '#f8fafc' }">
                      <div class="luck-grade-row" style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 13px; font-weight: 800; color: #64748b;">测算吉凶判定：</span>
                        <div class="luck-grade-badge" style="font-size: 16px; font-weight: 900; color: white; padding: 4px 14px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.06);" :style="{ background: plumResult.luckLevel.includes('大吉') ? 'linear-gradient(135deg, #fbbf24, #d97706)' : plumResult.luckLevel.includes('吉') ? 'linear-gradient(135deg, #34d399, #059669)' : plumResult.luckLevel.includes('大凶') ? 'linear-gradient(135deg, #f43f5e, #be123c)' : plumResult.luckLevel.includes('凶') ? 'linear-gradient(135deg, #fda4af, #e11d48)' : 'linear-gradient(135deg, #cbd5e1, #475569)' }">
                          {{ plumResult.luckLevel }}
                        </div>
                      </div>
                      
                      <div class="luck-detail-content" style="display: flex; flex-direction: column; gap: 10px;">
                        <p class="relation-desc-text" style="font-size: 13px; line-height: 1.5; color: #475569; margin: 0;"><strong>卦气气场：</strong>{{ plumResult.relationDesc }}</p>
                        <div class="rhyme-box text-left" style="background: rgba(255,255,255,0.7); border-radius: 12px; padding: 12px; display: flex; align-items: flex-start; gap: 6px; border-left: 4px solid #fbbf24; margin: 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.01);">
                          <span class="quote-mark" style="font-size: 24px; font-weight: bold; color: #cbd5e1; font-family: Georgia, serif; line-height: 1; margin-top: -5px;">“</span>
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
        </div>
      </el-col>
    </el-row>

    <!-- 2.8 生辰八字全息命理分析平台 -->
    <el-row :gutter="24" class="bazi-row" style="margin-bottom: 24px; margin-top: 24px;">
      <el-col :span="24">
        <div class="glass-card bazi-main-card" style="padding: 24px; display: flex; flex-direction: column;">
          <div class="card-glow-title" style="border-bottom: 1px dashed #e2e8f0; padding-bottom: 15px; margin-bottom: 20px;">
            <el-icon class="glow-icon"><Notebook /></el-icon>
            <span>生辰八字全息命理推排</span>
          </div>
          
          <el-row :gutter="24">
            <!-- 左侧：生日参数录入 -->
            <el-col :xs="24" :md="8" style="margin-bottom: 20px;">
              <div style="background: rgba(255,255,255,0.4); border-radius: 16px; padding: 20px; border: 1px solid rgba(0,0,0,0.02); height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
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
                  <el-button 
                    type="primary" 
                    size="large" 
                    style="width: 100%; background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; font-weight: 800; border-radius: 12px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);"
                    :loading="baziDeducing"
                    @click="calculateBaziDestiny"
                  >
                    ☯ 开启八字全息推算 ☯
                  </el-button>
                </div>
              </div>
            </el-col>

            <!-- 右侧：推算结果展示 -->
            <el-col :xs="24" :md="16">
              <!-- 空状态 -->
              <div v-if="baziDeducingStep === 0" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; border: 1px dashed rgba(99,102,241,0.2); border-radius: 16px; background: rgba(255,255,255,0.4); min-height: 250px; text-align: center;">
                <div style="font-size: 48px; color: #cbd5e1; margin-bottom: 12px; animation: spinTaiji 15s linear infinite; display: inline-block;">☯</div>
                <h4 style="font-size: 16px; font-weight: 800; color: #475569; margin: 0 0 6px 0;">命由天定 · 运由己造</h4>
                <p style="font-size: 12.5px; color: #94a3b8; max-width: 420px; line-height: 1.6; margin: 0;">请输入您的阳历生日信息并点击“开启八字全息推算”，我们将在此生成您的乾坤四柱排盘、五行能量配比以及详尽的日主命理解析。</p>
              </div>

              <!-- 推算中动效 -->
              <div v-else-if="baziDeducingStep === 1" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; border-radius: 16px; min-height: 250px; text-align: center;">
                <div style="font-size: 48px; color: #6366f1; margin-bottom: 12px; animation: spinTaiji 2s linear infinite; display: inline-block;">☯</div>
                <h4 style="font-size: 15px; font-weight: 800; color: #1e293b; margin: 0 0 10px 0;">排定乾坤四柱，推衍命理玄机...</h4>
                <div style="width: 180px; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; margin: 0 auto;">
                  <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); animation: loadProgress 1s ease-in-out infinite; transform-origin: left;"></div>
                </div>
              </div>

              <!-- 推演完成结果面板 -->
              <div v-else class="animate-fade-in" style="display: flex; flex-direction: column; gap: 16px;">
                <!-- 1. 四柱排盘看板 -->
                <div style="background: rgba(255,255,255,0.7); border-radius: 16px; padding: 16px; border: 1px solid rgba(0,0,0,0.02);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                    <span style="font-size: 13px; font-weight: 800; color: #1e293b;">📅 生日信息：{{ baziResult.solarDate }} ({{ baziResult.lunarDate }})</span>
                    <el-tag size="small" type="success" effect="dark" style="border: none; font-weight: 800;">八字命盘：{{ baziResult.eightCharStr }}</el-tag>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                    <div v-for="col in baziResult.columns" :key="col.name" style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 10px 6px; text-align: center; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.01);">
                      <div style="font-size: 11px; color: #94a3b8; font-weight: bold;">{{ col.name }}</div>
                      <!-- 十神 -->
                      <div>
                        <el-tag size="small" :type="col.tenGod === '日元' ? 'danger' : 'info'" effect="plain" style="font-size: 9px; padding: 0 4px; font-weight: bold; border-radius: 4px;">{{ col.tenGod }}</el-tag>
                      </div>
                      <!-- 干支大字 -->
                      <div style="font-size: 24px; font-weight: 900; line-height: 1.2; display: flex; justify-content: center; gap: 4px;">
                        <span :style="{ color: col.ganElement?.color }">{{ col.gan }}</span>
                        <span :style="{ color: col.zhiElement?.color }">{{ col.zhi }}</span>
                      </div>
                      <!-- 藏干 -->
                      <div style="font-size: 9px; color: #64748b; line-height: 1.3;">
                        <span style="color: #94a3b8; display: block; font-size: 8px; margin-bottom: 2px;">地支藏干</span>
                        <span v-for="cg in col.hideGan" :key="cg" style="margin: 0 2px;">{{ cg }}</span>
                      </div>
                      <!-- 纳音 -->
                      <div style="font-size: 9px; color: #475569; background: #f1f5f9; padding: 2px 4px; border-radius: 6px; font-weight: 700; margin-top: auto;">
                        {{ col.nayin }}
                      </div>
                    </div>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                  <!-- 2. 五行能量占比看板 -->
                  <div style="background: rgba(255,255,255,0.7); border-radius: 16px; padding: 16px; border: 1px solid rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                      <h4 style="font-size: 13.5px; font-weight: 800; color: #1e293b; margin: 0 0 12px 0;">📊 八字五行能量配比</h4>
                      <div style="display: flex; flex-direction: column; gap: 8px;">
                        <!-- 金 -->
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 11px; width: 36px; font-weight: bold; color: #64748b;">金（白）</span>
                          <el-progress :percentage="baziResult.elementRates['金']" color="#64748b" style="flex: 1;" :stroke-width="8" />
                          <span style="font-size: 11px; font-weight: bold; color: #475569; width: 45px; text-align: right;">{{ baziResult.elementCounts['金'] }}字 ({{ baziResult.elementRates['金'] }}%)</span>
                        </div>
                        <!-- 木 -->
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 11px; width: 36px; font-weight: bold; color: #10b981;">木（青）</span>
                          <el-progress :percentage="baziResult.elementRates['木']" color="#10b981" style="flex: 1;" :stroke-width="8" />
                          <span style="font-size: 11px; font-weight: bold; color: #475569; width: 45px; text-align: right;">{{ baziResult.elementCounts['木'] }}字 ({{ baziResult.elementRates['木'] }}%)</span>
                        </div>
                        <!-- 水 -->
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 11px; width: 36px; font-weight: bold; color: #3b82f6;">水（黑）</span>
                          <el-progress :percentage="baziResult.elementRates['水']" color="#3b82f6" style="flex: 1;" :stroke-width="8" />
                          <span style="font-size: 11px; font-weight: bold; color: #475569; width: 45px; text-align: right;">{{ baziResult.elementCounts['水'] }}字 ({{ baziResult.elementRates['水'] }}%)</span>
                        </div>
                        <!-- 火 -->
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 11px; width: 36px; font-weight: bold; color: #ef4444;">火（红）</span>
                          <el-progress :percentage="baziResult.elementRates['火']" color="#ef4444" style="flex: 1;" :stroke-width="8" />
                          <span style="font-size: 11px; font-weight: bold; color: #475569; width: 45px; text-align: right;">{{ baziResult.elementCounts['火'] }}字 ({{ baziResult.elementRates['火'] }}%)</span>
                        </div>
                        <!-- 土 -->
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 11px; width: 36px; font-weight: bold; color: #d97706;">土（黄）</span>
                          <el-progress :percentage="baziResult.elementRates['土']" color="#d97706" style="flex: 1;" :stroke-width="8" />
                          <span style="font-size: 11px; font-weight: bold; color: #475569; width: 45px; text-align: right;">{{ baziResult.elementCounts['土'] }}字 ({{ baziResult.elementRates['土'] }}%)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style="margin-top: 12px; background: #f8fafc; padding: 8px 12px; border-radius: 8px; font-size: 11.5px; line-height: 1.4; color: #64748b;">
                      * <strong>局势分析：</strong>此造中五行最盛为【<strong :style="{ color: baziResult.maxEl === '金' ? '#64748b' : baziResult.maxEl === '木' ? '#10b981' : baziResult.maxEl === '水' ? '#3b82f6' : baziResult.maxEl === '火' ? '#ef4444' : '#d97706' }">{{ baziResult.maxEl }}</strong>】(占比{{ baziResult.elementRates[baziResult.maxEl] }}%)，较薄弱为【<strong>{{ baziResult.minEl }}</strong>】。建议日常运势调和以【{{ baziResult.minEl }}】属性为主。
                    </div>
                  </div>

                  <!-- 3. 日元主命理解析看板 -->
                  <div style="background: rgba(255,255,255,0.7); border-radius: 16px; padding: 16px; border: 1px solid rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
                    <div>
                      <h4 style="font-size: 13.5px; font-weight: 800; color: #1e293b; margin: 0 0 10px 0; display: flex; align-items: center; gap: 6px;">
                        <span>☯</span> {{ baziResult.advice.title }}
                      </h4>
                      <p style="font-size: 12px; line-height: 1.5; color: #475569; margin: 0 0 8px 0;">
                        <strong>性格特质：</strong>{{ baziResult.advice.character }}
                      </p>
                      <p style="font-size: 12px; line-height: 1.5; color: #475569; margin: 0 0 8px 0;">
                        <strong>先天命格：</strong>{{ baziResult.advice.destiny }}
                      </p>
                      <p style="font-size: 12px; line-height: 1.5; color: #b45309; margin: 0;">
                        <strong>开运建议：</strong>{{ baziResult.advice.advice }}
                      </p>
                    </div>

                    <div style="background: linear-gradient(135deg, #fffbeb, #fef3c7); border-radius: 10px; padding: 10px; border-left: 4px solid #f59e0b; margin: 0;">
                      <div style="font-size: 12px; font-weight: bold; color: #b45309; margin-bottom: 2px;">开运太极谶：</div>
                      <div style="font-size: 12px; font-weight: 800; color: #78350f; font-family: monospace; line-height: 1.4;">
                        “{{ baziResult.advice.poem }}”
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 3. 三大标准映射数据字典 -->
    <div class="glass-card tables-section-card">
      <el-tabs v-model="activeTableTab" class="custom-tabs dictionary-tabs">
        <!-- 新增表零：10天干基础映射表 -->
        <el-tab-pane name="stems">
          <template #label>
            <span class="tab-label-custom">
              <span class="tab-badge-num">10</span>
              <span>10天干基础映射表</span>
            </span>
          </template>

          <div class="table-intro">
            注：天干代表天之气，共有十个，循环往复。它们分别对应着不同的阴阳五行属性和物象。
          </div>

          <div class="branches-grid">
            <div
              v-for="item in heavenlyStemsList"
              :key="item.id"
              class="branch-card-item"
              :class="[item.element, { highlighted: activeStem === item.name }]"
              @click="activeStem = item.name"
            >
              <div class="item-id-badge">ID: {{ item.id }}</div>
              <div class="item-main-row">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-pinyin">({{ item.pinyin }})</span>
                <span class="item-zodiac-tag" :style="{ background: item.polar === '阳' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(244, 63, 94, 0.08)', color: item.polar === '阳' ? '#4f46e5' : '#e11d48' }">{{ item.polar }}</span>
              </div>
              <div class="item-details-row">
                <div class="detail-sub">
                  <span class="lbl">五行:</span>
                  <span class="val bold-val" :class="item.element">{{ item.elementName }}</span>
                </div>
              </div>
              <div class="item-desc-bubble">
                {{ item.desc }}
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 表一：12地支基础映射表 -->
        <el-tab-pane name="branches">
          <template #label>
            <span class="tab-label-custom">
              <span class="tab-badge-num">12</span>
              <span>12地支基础映射表</span>
            </span>
          </template>

          <div class="table-intro">
            注：这里的月份是农历。古人认为正月（一月）是一年的开始，对应的是“寅”。
          </div>

          <div class="branches-grid">
            <div
              v-for="item in filteredBranches"
              :key="item.id"
              class="branch-card-item"
              :class="[item.element, { highlighted: simulatedBranchInfo.name === item.name }]"
              @click="selectBranchByName(item.name)"
            >
              <div class="item-id-badge">ID: {{ item.id }}</div>
              <div class="item-main-row">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-pinyin">({{ item.pinyin }})</span>
                <span class="item-zodiac-tag">{{ item.zodiac }}</span>
              </div>
              <div class="item-details-row">
                <div class="detail-sub">
                  <span class="lbl">月份:</span>
                  <span class="val">{{ item.month }}</span>
                </div>
                <div class="detail-sub">
                  <span class="lbl">能量:</span>
                  <span class="val bold-val">{{ item.elementName }}</span>
                </div>
              </div>
              <div class="item-desc-bubble">
                {{ item.elementDesc }}
              </div>
            </div>
            <el-empty
              v-if="filteredBranches.length === 0"
              description="没有找到匹配的地支信息"
            />
          </div>
        </el-tab-pane>

        <!-- 表二：24小时与时辰映射表 -->
        <el-tab-pane name="hours">
          <template #label>
            <span class="tab-label-custom">
              <span class="tab-badge-num">24</span>
              <span>24小时与时辰映射表</span>
            </span>
          </template>

          <div class="table-intro">
            古人把一天 24 小时平均分成了 12 个时辰，每个时辰跨度为 2 小时。
          </div>

          <div class="hours-grid">
            <div
              v-for="item in filteredHours"
              :key="item.id"
              class="hour-grid-item"
              :class="{ highlighted: simulatedBranchInfo.name === item.name }"
              @click="selectBranchByName(item.name)"
            >
              <div class="hour-time-header">
                {{ item.timeSpan }}
              </div>
              <div class="hour-main-row">
                <span class="hour-title">{{ item.name }}时</span>
                <span class="hour-zodiac-tag">{{ getBranchZodiac(item.name) }}</span>
              </div>
              <div class="hour-badge-row">
                <el-tag size="small" type="warning" effect="dark">ID: {{ item.id }}</el-tag>
              </div>
              <div class="hour-slogan-box">
                {{ item.rhyme }}
              </div>
            </div>
            <el-empty
              v-if="filteredHours.length === 0"
              description="没有找到匹配的时辰时间信息"
            />
          </div>
        </el-tab-pane>

        <!-- 表三：先天八卦数字映射表 -->
        <el-tab-pane name="bagua">
          <template #label>
            <span class="tab-label-custom">
              <span class="tab-badge-num">8</span>
              <span>先天八卦数字映射表 (起卦核心参数)</span>
            </span>
          </template>

          <div class="table-intro">
            这是梅花易数算法里最关键的“解密密钥”，算出的余数直接对应这 8 个卦。如果计算结果整除，余数是 0，映射中直接当作 8（坤卦）来用。
          </div>

          <div class="bagua-grid">
            <div
              v-for="item in filteredBagua"
              :key="item.id"
              class="bagua-card-item"
              :class="['gua-bg-' + item.id, { highlighted: guaResult.id === item.id }]"
              @click="inputNumber = item.id"
            >
              <div class="gua-id-badge">{{ item.id === 8 ? '8 / 0' : item.id }}</div>
              <div class="gua-symbol-large">{{ item.trigram }}</div>
              <div class="gua-meta">
                <h3>{{ item.name }}卦 ({{ item.pinyin }})</h3>
                <span class="gua-nature">意象：{{ item.nature }}</span>
              </div>
              <div class="gua-code-detail">
                {{ item.code }}
              </div>
            </div>
            <el-empty
              v-if="filteredBagua.length === 0"
              description="没有找到匹配的八卦信息"
            />
          </div>
        </el-tab-pane>

        <!-- 表四：先天八卦方位图 -->
        <el-tab-pane name="diagram">
          <template #label>
            <span class="tab-label-custom">
              <span class="tab-badge-num">☯</span>
              <span>先天八卦方位图</span>
            </span>
          </template>

          <div class="table-intro">
            先天八卦方位基于“天南地北”的宇宙空间法则（上南下北，左东右西）。点击八卦扇区可直接同步左上方的起卦余数。
          </div>

          <div class="diagram-tab-wrapper">
            <!-- 左列：旋转互动的先天八卦太极盘 -->
            <div class="bagua-plate-col">
              <div class="bagua-plate-outer-container">
                <svg viewBox="0 0 400 400" class="bagua-svg" :class="{ 'spinning-slowly': autoRotatePlate }">
                  <!-- 1. 最外层八角黄框 -->
                  <polygon
                    points="127.3,24.5 272.7,24.5 375.5,127.3 375.5,272.7 272.7,375.5 127.3,375.5 24.5,272.7 24.5,127.3"
                    class="bagua-octagon-border"
                  />
                  <!-- 2. 内层八角黄框 -->
                  <polygon
                    points="161.7,107.6 238.3,107.6 292.4,161.7 292.4,238.3 238.3,292.4 161.7,292.4 107.6,238.3 107.6,161.7"
                    class="bagua-octagon-inner"
                  />
                  <!-- 3. 最内层黄框太极圆 -->
                  <circle cx="200" cy="200" r="50" class="bagua-center-circle" />

                  <!-- 4. 8个扇区组（乾巽坎艮坤震离兑） -->
                  <g
                    v-for="item in diagramTrigrams"
                    :key="item.id"
                    :transform="`rotate(${item.angle}, 200, 200)`"
                    class="bagua-sector-group"
                    :class="{ active: inputNumber === item.id || hoveredTrigramId === item.id }"
                    @click="selectBaguaFromDiagram(item)"
                    @mouseenter="hoveredTrigramId = item.id"
                    @mouseleave="clearHoverTrigram"
                  >
                    <!-- 扇区玻璃填充块，悬停高亮 -->
                    <path
                      d="M 131.1 33.7 A 180 180 0 0 1 268.9 33.7 L 219.1 153.8 A 50 50 0 0 0 180.9 153.8 Z"
                      class="wedge-bg"
                      :style="{ '--hover-color': item.color }"
                    />
                    
                    <!-- 放射分割线 -->
                    <line x1="238.3" y1="107.6" x2="270.8" y2="29.1" class="radial-line" />

                    <!-- 卦象符号 (☰) 保持向外辐射，画在 x=200, y=70 (半径130) -->
                    <text x="200" y="70" class="trigram-symbol" :fill="item.color">{{ item.symbol }}</text>

                    <!-- 英文方向 (SOUTH, etc.) 保持向外辐射，画在 x=200, y=32 (半径170) -->
                    <text x="200" y="32" class="trigram-direction-eng" :fill="item.color">{{ item.engDir }}</text>
                  </g>

                  <!-- 5. 中心旋转太极图 (Yin-Yang) -->
                  <g class="taiji-center-group">
                    <!-- 左侧阴鱼 (深蓝/黑色) -->
                    <path d="M 200 150 A 50 50 0 0 0 200 250 A 25 25 0 0 0 200 200 A 25 25 0 0 1 200 150" fill="#1e1b4b" />
                    <!-- 右侧阳鱼 (乳白/黄色) -->
                    <path d="M 200 150 A 50 50 0 0 1 200 250 A 25 25 0 0 0 200 200 A 25 25 0 0 1 200 150" fill="#fffbeb" />
                    <!-- 阴阳眼 -->
                    <circle cx="200" cy="175" r="7" fill="#1e1b4b" />
                    <circle cx="200" cy="225" r="7" fill="#fffbeb" />
                  </g>

                  <!-- 6. 独立不旋转的内层中文卦名 (乾巽坎艮坤震离兑) -->
                  <!-- 它们独立在外渲染以保持水平直立，提升阅读体验 -->
                  <g
                    v-for="item in diagramTrigrams"
                    :key="'text-' + item.id"
                    class="bagua-name-static"
                    :class="{ active: inputNumber === item.id || hoveredTrigramId === item.id }"
                    :style="{ '--active-color': item.color }"
                    @click="selectBaguaFromDiagram(item)"
                    @mouseenter="hoveredTrigramId = item.id"
                    @mouseleave="clearHoverTrigram"
                  >
                    <text
                      :x="getStaticTextX(item.angle)"
                      :y="getStaticTextY(item.angle)"
                      text-anchor="middle"
                      dominant-baseline="central"
                      class="trigram-chinese-char"
                      :fill="item.color"
                    >
                      {{ item.name }}
                    </text>
                  </g>
                </svg>
              </div>

              <!-- 旋转控制选项 -->
              <div class="rotate-control-bar">
                <el-switch
                  v-model="autoRotatePlate"
                  active-text="开启太极盘慢旋转"
                  inactive-text="静止盘面"
                  inline-prompt
                  style="--el-switch-on-color: #6366f1; --el-switch-off-color: #94a3b8;"
                />
                <span class="control-tip">* 鼠标悬浮在盘面上时会自动暂停旋转，方便准确点击。</span>
              </div>
            </div>

            <!-- 右列：选中/悬浮卦象的现代全息解读卡 -->
            <div class="bagua-info-col">
              <div class="glass-card hologram-gua-detail" :style="{ '--detail-theme-color': currentDetailGua.color }">
                <div class="hologram-header">
                  <div class="hologram-symbol-box">
                    <span class="symbol-large animate-breath">{{ currentDetailGua.symbol }}</span>
                  </div>
                  <div class="hologram-title-box">
                    <h2 class="gua-fullname">{{ currentDetailGua.name }}卦 ({{ currentDetailGua.pinyin }})</h2>
                    <div class="gua-meta-badges">
                      <el-tag size="small" effect="dark" :color="currentDetailGua.color" style="border: none;">
                        五行：{{ getGuaElementCN(currentDetailGua.nature) }} ({{ currentDetailGua.nature }})
                      </el-tag>
                      <el-tag size="small" type="warning" effect="plain" class="gua-val-badge">
                        起卦数：{{ currentDetailGua.id }}
                      </el-tag>
                    </div>
                  </div>
                </div>

                <div class="hologram-body">
                  <div class="hologram-info-grid">
                    <div class="grid-item">
                      <span class="grid-label">自然意象</span>
                      <strong class="grid-value">{{ currentDetailGua.symbolNature }}</strong>
                    </div>
                    <div class="grid-item">
                      <span class="grid-label">宇宙方位</span>
                      <strong class="grid-value">{{ currentDetailGua.direction }} ({{ currentDetailGua.engDir }})</strong>
                    </div>
                    <div class="grid-item">
                      <span class="grid-label">代号编码</span>
                      <strong class="grid-value">{{ currentDetailGua.code }}</strong>
                    </div>
                  </div>

                  <div class="hologram-description-section">
                    <h4>卦义象解</h4>
                    <p class="gua-meaning-desc">
                      {{ getGuaExtendedDesc(currentDetailGua.id) }}
                    </p>
                  </div>

                  <div class="hologram-action-box">
                    <el-button
                      type="primary"
                      size="default"
                      class="sync-gua-btn"
                      :style="{ background: currentDetailGua.color, borderColor: currentDetailGua.color }"
                      @click="selectBaguaFromDiagram(currentDetailGua)"
                    >
                      🔮 设为当前起卦数 ({{ currentDetailGua.id }})
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 2.5 三大掌诀指诀图 -->
    <el-row :gutter="24" class="palms-row" style="margin-bottom: 24px; margin-top: 24px;">
      <!-- 天干掌诀 -->
      <el-col :xs="24" :md="8" style="margin-bottom: 24px;">
        <div class="glass-card hand-card">
          <div class="card-glow-title text-center" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <el-icon class="glow-icon"><Pointer /></el-icon>
            <span>掐指神算 · 天干掌诀</span>
          </div>
          <div class="hand-description">
            点击天干可切换并查看五行阴阳与性情释义；十天干绕掌心顺时针分布。
          </div>
          <div class="hand-container">
            <div class="hand-outline">
              <div class="finger-labels">
                <span class="label-item">食指</span>
                <span class="label-item">中指</span>
                <span class="label-item">无名指</span>
                <span class="label-item">小指</span>
              </div>
              <div class="finger-joints-grid">
                <!-- Row 1 -->
                <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '丁' }" @click="activeStem = '丁'">
                  <span class="joint-name">丁</span>
                  <span class="joint-pinyin">dīng</span>
                  <span class="joint-badge flame">火</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '戊' }" @click="activeStem = '戊'">
                  <span class="joint-name">戊</span>
                  <span class="joint-pinyin">wù</span>
                  <span class="joint-badge earth">土</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '己' }" @click="activeStem = '己'">
                  <span class="joint-name">己</span>
                  <span class="joint-pinyin">jǐ</span>
                  <span class="joint-badge earth">土</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '庚' }" @click="activeStem = '庚'">
                  <span class="joint-name">庚</span>
                  <span class="joint-pinyin">gēng</span>
                  <span class="joint-badge gold">金</span>
                </div>

                <!-- Row 2 -->
                <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '丙' }" @click="activeStem = '丙'">
                  <span class="joint-name">丙</span>
                  <span class="joint-pinyin">bǐng</span>
                  <span class="joint-badge flame">火</span>
                </div>
                <!-- 掌心 (2x2) -->
                <div class="hand-center-taiji" style="grid-column: span 2; grid-row: span 2;">
                  <div class="taiji-mini-spin">☯</div>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '辛' }" @click="activeStem = '辛'">
                  <span class="joint-name">辛</span>
                  <span class="joint-pinyin">xīn</span>
                  <span class="joint-badge gold">金</span>
                </div>

                <!-- Row 3 -->
                <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '乙' }" @click="activeStem = '乙'">
                  <span class="joint-name">乙</span>
                  <span class="joint-pinyin">yǐ</span>
                  <span class="joint-badge wood">木</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '壬' }" @click="activeStem = '壬'">
                  <span class="joint-name">壬</span>
                  <span class="joint-pinyin">rén</span>
                  <span class="joint-badge water">水</span>
                </div>

                <!-- Row 4 -->
                <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '甲' }" @click="activeStem = '甲'">
                  <span class="joint-name">甲</span>
                  <span class="joint-pinyin">jiǎ</span>
                  <span class="joint-badge wood">木</span>
                </div>
                <div class="joint-cell cell-empty-place"></div>
                <div class="joint-cell cell-empty-place"></div>
                <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '癸' }" @click="activeStem = '癸'">
                  <span class="joint-name">癸</span>
                  <span class="joint-pinyin">guǐ</span>
                  <span class="joint-badge water">水</span>
                </div>
              </div>
            </div>
            
            <!-- 天干详细解读卡片 -->
            <div class="branch-detail-panel stem-detail-panel" :class="activeStemInfo.element" style="margin-top: 15px; width: 100%;">
              <div class="detail-badge-row">
                <el-tag effect="dark" :class="'element-tag ' + activeStemInfo.element">
                  五行：{{ activeStemInfo.elementName }}
                </el-tag>
                <el-tag type="info" effect="plain" style="color: #475569; border-color: #cbd5e1;">
                  阴阳：{{ activeStemInfo.polar }}性
                </el-tag>
              </div>
              <div class="detail-content">
                <div class="main-info">
                  <span class="zodiac-pic">☯</span>
                  <div class="info-text">
                    <h3>{{ activeStemInfo.name }} ({{ activeStemInfo.pinyin }}) · {{ activeStemInfo.polar }}{{ activeStemInfo.elementName }}</h3>
                    <p class="modern-time" style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.5;">{{ activeStemInfo.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 地支掌诀 -->
      <el-col :xs="24" :md="8" style="margin-bottom: 24px;">
        <div class="glass-card hand-card">
          <div class="card-glow-title text-center" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <el-icon class="glow-icon"><Pointer /></el-icon>
              <span>掐指神算 · 地支掌诀</span>
            </div>
            <el-tooltip content="点击查看传统掌法指诀口诀图" placement="top" effect="dark">
              <el-button 
                type="warning" 
                circle 
                size="small" 
                class="hand-diagram-btn"
                @click="showTraditionalHandDialog = true"
              >
                <el-icon><Picture /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
          <div class="hand-description">
            点击指节可切换手动模拟时间并锁定地支；金色高亮为实时时辰轨迹。
          </div>
          <div class="hand-container">
            <div class="hand-outline">
              <div class="finger-labels">
                <span class="label-item">食指</span>
                <span class="label-item">中指</span>
                <span class="label-item">无名指</span>
                <span class="label-item">小指</span>
              </div>
              <div class="finger-joints-grid">
                <!-- Row 1 -->
                <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '巳' }" @click="selectBranchByName('巳')">
                  <span class="joint-name">巳</span>
                  <span class="joint-pinyin">sì</span>
                  <span class="joint-badge flame">火</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '午' }" @click="selectBranchByName('午')">
                  <span class="joint-name">午</span>
                  <span class="joint-pinyin">wǔ</span>
                  <span class="joint-badge flame">火</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '未' }" @click="selectBranchByName('未')">
                  <span class="joint-name">未</span>
                  <span class="joint-pinyin">wèi</span>
                  <span class="joint-badge earth">土</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '申' }" @click="selectBranchByName('申')">
                  <span class="joint-name">申</span>
                  <span class="joint-pinyin">shēn</span>
                  <span class="joint-badge gold">金</span>
                </div>

                <!-- Row 2 -->
                <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '辰' }" @click="selectBranchByName('辰')">
                  <span class="joint-name">辰</span>
                  <span class="joint-pinyin">chén</span>
                  <span class="joint-badge earth">土</span>
                </div>
                <!-- 掌心 (2x2) -->
                <div class="hand-center-taiji" style="grid-column: span 2; grid-row: span 2;">
                  <div class="taiji-mini-spin">☯</div>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '酉' }" @click="selectBranchByName('酉')">
                  <span class="joint-name">酉</span>
                  <span class="joint-pinyin">yǒu</span>
                  <span class="joint-badge gold">金</span>
                </div>

                <!-- Row 3 -->
                <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '卯' }" @click="selectBranchByName('卯')">
                  <span class="joint-name">卯</span>
                  <span class="joint-pinyin">mǎo</span>
                  <span class="joint-badge wood">木</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '戌' }" @click="selectBranchByName('戌')">
                  <span class="joint-name">戌</span>
                  <span class="joint-pinyin">xū</span>
                  <span class="joint-badge earth">土</span>
                </div>

                <!-- Row 4 -->
                <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '寅' }" @click="selectBranchByName('寅')">
                  <span class="joint-name">寅</span>
                  <span class="joint-pinyin">yín</span>
                  <span class="joint-badge wood">木</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '丑' }" @click="selectBranchByName('丑')">
                  <span class="joint-name">丑</span>
                  <span class="joint-pinyin">chǒu</span>
                  <span class="joint-badge earth">土</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '子' }" @click="selectBranchByName('子')">
                  <span class="joint-name">子</span>
                  <span class="joint-pinyin">zǐ</span>
                  <span class="joint-badge water">水</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '亥' }" @click="selectBranchByName('亥')">
                  <span class="joint-name">亥</span>
                  <span class="joint-pinyin">hài</span>
                  <span class="joint-badge water">水</span>
                </div>
              </div>
            </div>
            
            <!-- 地支详细解读卡片 -->
            <div class="branch-detail-panel" :class="simulatedBranchInfo.element" style="margin-top: 15px; width: 100%;">
              <div class="detail-badge-row">
                <el-tag effect="dark" :class="'element-tag ' + simulatedBranchInfo.element">
                  五行：{{ simulatedBranchInfo.elementName }}
                </el-tag>
                <el-tag type="info" effect="plain" style="color: #475569; border-color: #cbd5e1;">
                  生肖：{{ simulatedBranchInfo.zodiacEmoji }} {{ simulatedBranchInfo.zodiac }}
                </el-tag>
              </div>
              <div class="detail-content">
                <div class="main-info">
                  <span class="zodiac-pic">{{ simulatedBranchInfo.zodiacEmoji }}</span>
                  <div class="info-text">
                    <h3>{{ simulatedBranchInfo.name }} ({{ simulatedBranchInfo.pinyin }}) · {{ simulatedBranchInfo.zodiac }}时</h3>
                    <p class="modern-time" style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.5;">
                      时间段：{{ simulatedBranchInfo.timeSpan }}<br/>
                      月份：{{ simulatedBranchInfo.month }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 八卦掌诀 -->
      <el-col :xs="24" :md="8" style="margin-bottom: 24px;">
        <div class="glass-card hand-card">
          <div class="card-glow-title text-center" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <el-icon class="glow-icon"><Pointer /></el-icon>
            <span>掐指神算 · 八卦掌诀</span>
          </div>
          <div class="hand-description">
            点击卦名查看后天八卦方位与象征意象；九宫格对应手掌外圈及掌心。
          </div>
          <div class="hand-container">
            <div class="hand-outline">
              <div class="finger-labels">
                <span class="label-item">食指</span>
                <span class="label-item">中指</span>
                <span class="label-item">无名指</span>
                <span class="label-item">小指</span>
              </div>
              <div class="finger-joints-grid">
                <!-- Row 1 -->
                <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '巽' }" @click="activeBagua = '巽'">
                  <span class="joint-name">巽</span>
                  <span class="joint-pinyin">xùn ☴</span>
                  <span class="joint-badge wood">木</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '离' }" @click="activeBagua = '离'">
                  <span class="joint-name">离</span>
                  <span class="joint-pinyin">lí ☲</span>
                  <span class="joint-badge flame">火</span>
                </div>
                <div class="joint-cell cell-empty-place"></div>
                <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '坤' }" @click="activeBagua = '坤'">
                  <span class="joint-name">坤</span>
                  <span class="joint-pinyin">kūn ☷</span>
                  <span class="joint-badge earth">土</span>
                </div>

                <!-- Row 2 -->
                <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '震' }" @click="activeBagua = '震'">
                  <span class="joint-name">震</span>
                  <span class="joint-pinyin">zhèn ☳</span>
                  <span class="joint-badge wood">木</span>
                </div>
                <!-- 掌心 (2x2) -->
                <div class="hand-center-taiji" style="grid-column: span 2; grid-row: span 2;">
                  <div class="taiji-mini-spin">☯</div>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '兑' }" @click="activeBagua = '兑'">
                  <span class="joint-name">兑</span>
                  <span class="joint-pinyin">duì ☱</span>
                  <span class="joint-badge gold">金</span>
                </div>

                <!-- Row 3 -->
                <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '艮' }" @click="activeBagua = '艮'">
                  <span class="joint-name">艮</span>
                  <span class="joint-pinyin">gèn ☶</span>
                  <span class="joint-badge earth">土</span>
                </div>
                <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '乾' }" @click="activeBagua = '乾'">
                  <span class="joint-name">乾</span>
                  <span class="joint-pinyin">qián ☰</span>
                  <span class="joint-badge gold">金</span>
                </div>

                <!-- Row 4 -->
                <div class="joint-cell cell-empty-place"></div>
                <div class="joint-cell cell-empty-place"></div>
                <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '坎' }" @click="activeBagua = '坎'">
                  <span class="joint-name">坎</span>
                  <span class="joint-pinyin">kǎn ☵</span>
                  <span class="joint-badge water">水</span>
                </div>
                <div class="joint-cell cell-empty-place"></div>
              </div>
            </div>
            
            <!-- 八卦详细解读卡片 -->
            <div class="branch-detail-panel bagua-detail-panel" :class="activeBaguaInfo.element" style="margin-top: 15px; width: 100%;">
              <div class="detail-badge-row">
                <el-tag effect="dark" :class="'element-tag ' + activeBaguaInfo.element">
                  五行：{{ activeBaguaInfo.elementName }}
                </el-tag>
                <el-tag type="info" effect="plain" style="color: #475569; border-color: #cbd5e1;">
                  阴阳：{{ activeBaguaInfo.yinYang }}性
                </el-tag>
                <el-tag type="warning" effect="dark" style="border: none;">
                  卦符：{{ activeBaguaInfo.trigram }}
                </el-tag>
              </div>
              <div class="detail-content">
                <div class="main-info">
                  <span class="zodiac-pic" style="font-size: 24px;">{{ activeBaguaInfo.trigram }}</span>
                  <div class="info-text">
                    <h3>{{ activeBaguaInfo.name }}卦 ({{ activeBaguaInfo.pinyin }}) · {{ activeBaguaInfo.nature }}</h3>
                    <p class="modern-time" style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.5;">
                      <strong>象征：</strong>{{ activeBaguaInfo.code }}<br/>
                      <strong>释义：</strong>{{ activeBaguaInfo.desc }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <el-dialog
      v-model="showTraditionalHandDialog"
      title="传统地支掌诀排法口诀"
      width="460px"
      top="8vh"
      append-to-body
      destroy-on-close
      class="traditional-hand-dialog"
    >
      <div class="dialog-img-container">
        <img :src="traditionalHandMapImg" alt="传统地支掌诀排法" class="traditional-hand-img" />
        <div class="traditional-hand-tip">
          <strong>💡 古人“掐指一算”传统掌诀定位：</strong><br/>
          以左手为盘，按顺时针次序环绕食指、中指、无名指和小指的指节排定十二地支：
          <ul style="margin: 5px 0; padding-left: 20px;">
            <li><strong>子（北）</strong>：位于无名指根部</li>
            <li><strong>午（南）</strong>：位于中指尖端</li>
            <li><strong>卯（东）</strong>：位于食指中节</li>
            <li><strong>酉（西）</strong>：位于小指中节</li>
          </ul>
          古人在测算时，常以大拇指点按对应关节进行推演排盘，称为“掐指神算”。
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Solar } from 'lunar-javascript'
import { Search, Clock, Opportunity, Pointer, MagicStick, WarningFilled, Notebook, Picture } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import traditionalHandMapImg from '../pic/traditional_hand_map.png'

// 搜索过滤与 Tab 状态
const searchQuery = ref('')
const activeTableTab = ref('stems')
const showTraditionalHandDialog = ref(false)

// 实时时间计算
const liveTime = ref(dayjs().format('HH:mm:ss'))
const isAutoTime = ref(true)
const simulatedHour = ref(dayjs().hour())

// 起卦数输入
const inputNumber = ref(5)

let timer = null

onMounted(() => {
  // 每秒更新实时时间
  timer = setInterval(() => {
    const now = dayjs()
    liveTime.value = now.format('HH:mm:ss')
    if (isAutoTime.value) {
      simulatedHour.value = now.hour()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const resumeAutoTime = () => {
  isAutoTime.value = true
  simulatedHour.value = dayjs().hour()
}

// 格式化时间输出
const formatHour = (h) => {
  return h.toString().padStart(2, '0') + ':00'
}

// 随机产生一个起卦数
const randomizeGuaNum = () => {
  inputNumber.value = Math.floor(Math.random() * 9999) + 1
}

// 三大标准映射表常量定义
const branchesList = [
  { id: 1, name: '子', pinyin: 'zǐ', zodiac: '鼠', zodiacEmoji: '🐭', month: '十一月', element: 'water', elementName: '水', elementDesc: '水（寒冬冰冻）' },
  { id: 2, name: '丑', pinyin: 'chǒu', zodiac: '牛', zodiacEmoji: '🐮', month: '十二月', element: 'earth', elementName: '土', elementDesc: '土（湿土、冬末）' },
  { id: 3, name: '寅', pinyin: 'yín', zodiac: '虎', zodiacEmoji: '🐯', month: '正月（一月）', element: 'wood', elementName: '木', elementDesc: '木（初春萌芽）' },
  { id: 4, name: '卯', pinyin: 'mǎo', zodiac: '兔', zodiacEmoji: '🐰', month: '二月', element: 'wood', elementName: '木', elementDesc: '木（仲春茂盛）' },
  { id: 5, name: '辰', pinyin: 'chén', zodiac: '龙', zodiacEmoji: '🐲', month: '三月', element: 'earth', elementName: '土', elementDesc: '土（水库、春末）' },
  { id: 6, name: '巳', pinyin: 'sì', zodiac: '蛇', zodiacEmoji: '🐍', month: '四月', element: 'flame', elementName: '火', elementDesc: '火（初夏渐热）' },
  { id: 7, name: '午', pinyin: 'wǔ', zodiac: '马', zodiacEmoji: '🐴', month: '五月', element: 'flame', elementName: '火', elementDesc: '火（仲夏大热）' },
  { id: 8, name: '未', pinyin: 'wèi', zodiac: '羊', zodiacEmoji: '🐑', month: '六月', element: 'earth', elementName: '土', elementDesc: '土（木库、夏末）' },
  { id: 9, name: '申', pinyin: 'shēn', zodiac: '猴', zodiacEmoji: '🐵', month: '七月', element: 'gold', elementName: '金', elementDesc: '金（初秋转凉）' },
  { id: 10, name: '酉', pinyin: 'yǒu', zodiac: '鸡', zodiacEmoji: '🐔', month: '八月', element: 'gold', elementName: '金', elementDesc: '金（仲秋肃杀）' },
  { id: 11, name: '戌', pinyin: 'xū', zodiac: '狗', zodiacEmoji: '🐶', month: '九月', element: 'earth', elementName: '土', elementDesc: '土（火库、秋末）' },
  { id: 12, name: '亥', pinyin: 'hài', zodiac: '猪', zodiacEmoji: '🐷', month: '十月', element: 'water', elementName: '水', elementDesc: '水（初冬水旺）' }
]

const hoursList = [
  { id: 1, name: '子', timeSpan: '23:00 ~ 01:00', rhyme: '夜深人静，老鼠出没' },
  { id: 2, name: '丑', timeSpan: '01:00 ~ 03:00', rhyme: '牛开始倒嚼、反刍' },
  { id: 3, name: '寅', timeSpan: '03:00 ~ 05:00', rhyme: '黎明前夕，老虎最凶猛' },
  { id: 4, name: '卯', timeSpan: '05:00 ~ 07:00', rhyme: '太阳升起，兔子出窝（古人上班点卯）' },
  { id: 5, name: '辰', timeSpan: '07:00 ~ 09:00', rhyme: '容易起雾，群龙行雨' },
  { id: 6, name: '巳', timeSpan: '09:00 ~ 11:00', rhyme: '艳阳当空，蛇伏草丛' },
  { id: 7, name: '午', timeSpan: '11:00 ~ 13:00', rhyme: '阳气最盛，烈马奔腾（午休）' },
  { id: 8, name: '未', timeSpan: '13:00 ~ 15:00', rhyme: '太阳偏西，羊吃草最肥' },
  { id: 9, name: '申', timeSpan: '15:00 ~ 17:00', rhyme: '日落西山，猴子啼叫' },
  { id: 10, name: '酉', timeSpan: '17:00 ~ 19:00', rhyme: '鸡啼归巢，夜幕降临' },
  { id: 11, name: '戌', timeSpan: '19:00 ~ 21:00', rhyme: '华灯初上，狗看家护院' },
  { id: 12, name: '亥', timeSpan: '21:00 ~ 23:00', rhyme: '人定时刻，猪熟睡打呼' }
]

const baguaList = [
  { id: 1, name: '乾', pinyin: 'qián', nature: '天', trigram: '☰', code: '强健、一把手、头部' },
  { id: 2, name: '兑', pinyin: 'duì', nature: '泽', trigram: '☱', code: '喜悦、开口、缺口、软件接口' },
  { id: 3, name: '离', pinyin: 'lí', nature: '火', trigram: '☲', code: '光明、美丽、依赖、外刚内柔' },
  { id: 4, name: '震', pinyin: 'zhèn', nature: '雷', trigram: '☳', code: '变动、出发、速度、创新' },
  { id: 5, name: '巽', pinyin: 'xùn', nature: '风', trigram: '☴', code: '渗透、无孔不入、渠道、运营' },
  { id: 6, name: '坎', pinyin: 'kǎn', nature: '水', trigram: '☵', code: '坎坷、陷阱、危机、核心算法' },
  { id: 7, name: '艮', pinyin: 'gèn', nature: '山', trigram: '☶', code: '停止、阻碍、稳定、硬件底座' },
  { id: 8, name: '坤', pinyin: 'kūn', nature: '地', trigram: '☷', code: '包容、承载、配合、用户数据库' }
]

// 天干与八卦状态及常量
const activeStem = ref('甲')
const activeBagua = ref('乾')

const heavenlyStemsList = [
  { id: 1, name: '甲', pinyin: 'jiǎ', element: 'wood', elementName: '木', polar: '阳', desc: '甲木为参天大树，领袖、栋梁之才，正直向上。' },
  { id: 2, name: '乙', pinyin: 'yǐ', element: 'wood', elementName: '木', polar: '阴', desc: '乙木为花草灌木，柔顺、适应力强，具有韧性。' },
  { id: 3, name: '丙', pinyin: 'bǐng', element: 'flame', elementName: '火', polar: '阳', desc: '丙火为太阳之火，热情、光明磊落，普照万物。' },
  { id: 4, name: '丁', pinyin: 'dīng', element: 'flame', elementName: '火', polar: '阴', desc: '丁火为灯烛之火，温和、内敛、照亮他人，具有奉献精神。' },
  { id: 5, name: '戊', pinyin: 'wù', element: 'earth', elementName: '土', polar: '阳', desc: '戊土为高山厚土，稳重、忠厚、保护力强，讲信用。' },
  { id: 6, name: '己', pinyin: 'jǐ', element: 'earth', elementName: '土', polar: '阴', desc: '己土为田园湿土，包容、孕育、乐于助人，多才多艺。' },
  { id: 7, name: '庚', pinyin: 'gēng', element: 'gold', elementName: '金', polar: '阳', desc: '庚金为刀剑斧刃，刚强、果断、有正义感，讲究规矩。' },
  { id: 8, name: '辛', pinyin: 'xīn', element: 'gold', elementName: '金', polar: '阴', desc: '辛金为珠玉首饰，精致、温润、独特，追求完美。' },
  { id: 9, name: '壬', pinyin: 'rén', element: 'water', elementName: '水', polar: '阳', desc: '壬水为江河大水，奔涌、智慧、有远见，大局观强。' },
  { id: 10, name: '癸', pinyin: 'guǐ', element: 'water', elementName: '水', polar: '阴', desc: '癸水为雨露之水，滋润、灵动、温柔，富有创意。' }
]

const activeStemInfo = computed(() => {
  return heavenlyStemsList.find(s => s.name === activeStem.value) || heavenlyStemsList[0]
})

const activeBaguaInfo = computed(() => {
  const base = baguaList.find(b => b.name === activeBagua.value) || baguaList[0]
  const natureToElement = {
    '天': { element: 'gold', name: '金', yinYang: '阳', desc: '至健至刚，天行健，自强不息' },
    '泽': { element: 'gold', name: '金', yinYang: '阴', desc: '喜悦沟通，丽泽兑，朋友相学' },
    '火': { element: 'flame', name: '火', yinYang: '阴', desc: '光明美丽，明两作照，守中正' },
    '雷': { element: 'wood', name: '木', yinYang: '阳', desc: '变动爆发，雷震千里，警醒自修' },
    '风': { element: 'wood', name: '木', yinYang: '阴', desc: '无孔不入，柔顺渗透，申命行事' },
    '水': { element: 'water', name: '水', yinYang: '阳', desc: '坎坷险陷，沉淀心智，常德行进' },
    '山': { element: 'earth', name: '土', yinYang: '阳', desc: '静止阻碍，安如磐石，适可而止' },
    '地': { element: 'earth', name: '土', yinYang: '阴', desc: '包容厚德，坤厚载物，德合无疆' }
  }
  const match = natureToElement[base.nature]
  return {
    ...base,
    element: match ? match.element : 'gold',
    elementName: match ? match.name : '金',
    yinYang: match ? match.yinYang : '阳',
    desc: match ? match.desc : ''
  }
})

// 辅助方法获取生肖
const getBranchZodiac = (branchName) => {
  const match = branchesList.find(b => b.name === branchName)
  return match ? `${match.zodiacEmoji} ${match.zodiac}` : ''
}

// 掐指神算点击切换地支
const selectBranchByName = (branchName) => {
  isAutoTime.value = false
  const match = hoursList.find(h => h.name === branchName)
  if (match) {
    // 设置为该时间段的起始小时
    const hourStartStr = match.timeSpan.split(' ~ ')[0]
    const hour = parseInt(hourStartStr.split(':')[0])
    simulatedHour.value = hour
  }
}

// 时间转换算法
const getBranchByHour = (hour) => {
  // 根据 modern 24 小时求时辰地支名称
  // 子时 23:00 - 01:00 (跨日)
  if (hour >= 23 || hour < 1) return '子'
  if (hour >= 1 && hour < 3) return '丑'
  if (hour >= 3 && hour < 5) return '寅'
  if (hour >= 5 && hour < 7) return '卯'
  if (hour >= 7 && hour < 9) return '辰'
  if (hour >= 9 && hour < 11) return '巳'
  if (hour >= 11 && hour < 13) return '午'
  if (hour >= 13 && hour < 15) return '未'
  if (hour >= 15 && hour < 17) return '申'
  if (hour >= 17 && hour < 19) return '酉'
  if (hour >= 19 && hour < 21) return '戌'
  if (hour >= 21 && hour < 23) return '亥'
  return '子'
}

// 计算属性：当前实时时间的时辰
const currentBranchInfo = computed(() => {
  const hour = dayjs().hour()
  const branchName = getBranchByHour(hour)
  return branchesList.find(b => b.name === branchName) || branchesList[0]
})

// 计算属性：模拟/选中的时间的时辰全量信息
const simulatedBranchInfo = computed(() => {
  const branchName = getBranchByHour(simulatedHour.value)
  const base = branchesList.find(b => b.name === branchName) || branchesList[0]
  const hourInfo = hoursList.find(h => h.name === branchName) || hoursList[0]
  return {
    ...base,
    timeSpan: hourInfo.timeSpan,
    rhyme: hourInfo.rhyme
  }
})

// 起卦数余数与卦象计算
const guaRemainder = computed(() => {
  if (!inputNumber.value) return 0
  const rem = inputNumber.value % 8
  return rem
})

const guaResult = computed(() => {
  const rem = guaRemainder.value
  const targetId = rem === 0 ? 8 : rem
  return baguaList.find(g => g.id === targetId) || baguaList[7]
})

// 模糊搜索逻辑
const filteredBranches = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return branchesList
  return branchesList.filter(item =>
    item.name.includes(q) ||
    item.pinyin.includes(q) ||
    item.zodiac.includes(q) ||
    item.elementName.includes(q) ||
    item.elementDesc.includes(q)
  )
})

const filteredHours = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return hoursList
  return hoursList.filter(item =>
    item.name.includes(q) ||
    item.timeSpan.includes(q) ||
    item.rhyme.includes(q) ||
    getBranchZodiac(item.name).includes(q)
  )
})

const filteredBagua = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return baguaList
  return baguaList.filter(item =>
    item.name.includes(q) ||
    item.pinyin.includes(q) ||
    item.nature.includes(q) ||
    item.code.includes(q) ||
    item.trigram.includes(q) ||
    item.id.toString() === q
  )
})

// 先天八卦图相关配置与状态
const autoRotatePlate = ref(true)
const hoveredTrigramId = ref(null)

const diagramTrigrams = [
  { id: 1, name: '乾', pinyin: 'qián', symbol: '☰', nature: '天', direction: '正南', engDir: 'SOUTH', color: '#64748b', angle: 0 },
  { id: 5, name: '巽', pinyin: 'xùn', symbol: '☴', nature: '风', direction: '西南', engDir: 'SOUTHWEST', color: '#a855f7', angle: 45 },
  { id: 6, name: '坎', pinyin: 'kǎn', symbol: '☵', nature: '水', direction: '正西', engDir: 'WEST', color: '#1e3a8a', angle: 90 },
  { id: 7, name: '艮', pinyin: 'gèn', symbol: '☶', nature: '山', direction: '西北', engDir: 'NORTHWEST', color: '#0284c7', angle: 135 },
  { id: 8, name: '坤', pinyin: 'kūn', symbol: '☷', nature: '地', direction: '正北', engDir: 'NORTH', color: '#db2777', angle: 180 },
  { id: 4, name: '震', pinyin: 'zhèn', symbol: '☳', nature: '雷', direction: '东北', engDir: 'NORTHEAST', color: '#16a34a', angle: 225 },
  { id: 3, name: '离', pinyin: 'lí', symbol: '☲', nature: '火', direction: '正东', engDir: 'EAST', color: '#dc2626', angle: 270 },
  { id: 2, name: '兑', pinyin: 'duì', symbol: '☱', nature: '泽', direction: '东南', engDir: 'SOUTHEAST', color: '#94a3b8', angle: 315 },
]

const selectBaguaFromDiagram = (item) => {
  inputNumber.value = item.id
}

const clearHoverTrigram = () => {
  hoveredTrigramId.value = null
}

const currentDetailGua = computed(() => {
  const id = hoveredTrigramId.value || inputNumber.value || 1
  const trigram = diagramTrigrams.find(t => t.id === id)
  if (!trigram) return diagramTrigrams[0]
  const standardGua = baguaList.find(b => b.id === id)
  return {
    ...trigram,
    code: standardGua ? standardGua.code : '',
    symbolNature: standardGua ? standardGua.nature : trigram.nature
  }
})

const getStaticTextX = (angle) => {
  const rad = (angle * Math.PI) / 180
  return 200 + 72 * Math.sin(rad)
}

const getStaticTextY = (angle) => {
  const rad = (angle * Math.PI) / 180
  return 200 - 72 * Math.cos(rad)
}

const getGuaExtendedDesc = (id) => {
  const descriptions = {
    1: '乾为天，至健至刚。象征天道运转，自强不息。在玄学推演中代表一把手、领头羊、核心头部以及坚不可摧的本源能量。',
    2: '兑为泽，喜悦柔顺。象征水之润泽与欢愉。在实践字典中代表开口说话、情感沟通、外部缺口，亦可对应互联网软件的技术接口与交互体验。',
    3: '离为火，光明美丽。象征烈火之炽热与依赖附着。在周易预测中代表核心视觉、光明前景、科技媒体，五行属火，主智慧与激情运转。',
    4: '震为雷，动荡爆发。象征春雷一声万物萌芽。代表速度、创新、变动、勇敢出发。在项目开发中主导架构突破与业务快速起飞。',
    5: '巽为风，无孔不入。象征春风之柔和渗透。代表卓越的传播渠道、品牌运营以及长线渗透。在五行中属木，主顺从与生机盎然。',
    6: '坎为水，坎坷险陷。象征深渊之危机与沉淀。代表核心算法的深度突破、危机管理和重重考验，五行属水，暗藏智慧与坚韧。',
    7: '艮为山，静止稳定。象征重峦叠嶂之稳固与止步。在现代系统中代表底座硬件、稳定基建、停步反思，五行属土，主厚德载物与安如磐石。',
    8: '坤为地，至顺至柔。象征大地之宽广包容，承载万物。在数据管理中代表底层庞大的用户数据库、强大的包容承载力，德合无疆。'
  }
  return descriptions[id] || ''
}

const getGuaElementCN = (nature) => {
  const elements = {
    '天': '金',
    '泽': '金',
    '火': '火',
    '雷': '木',
    '风': '木',
    '水': '水',
    '山': '土',
    '地': '土'
  }
  }

// ==========================================
// 🔮 梅花易数全息起卦推演核心系统
// ==========================================

// 八卦卦画核心基础信息表（1-8 先天八卦，trigram 对应 [初爻, 二爻, 三爻] 0代表阴, 1代表阳）
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
  "1-1": { name: "乾为天", desc: "至健大吉。天行健，自强不息。名利双收之象。" },
  "1-2": { name: "天泽履", desc: "如履薄冰。礼待他人，防微杜渐，谨慎则吉。" },
  "1-3": { name: "天火同人", desc: "天下大同。志同道合，团结协作，无往不利。" },
  "1-4": { name: "天雷无妄", desc: "顺应天意。坚守正道，切勿妄动，平实无怨。" },
  "1-5": { name: "天风姤", desc: "邂逅相遇。防范暗流，女强男弱，顺其自然。" },
  "1-6": { name: "天水讼", desc: "争讼克制。防口舌争端，宜和为贵，退一步海阔天空。" },
  "1-7": { name: "天山遁", desc: "退避隐遁。蓄势待发，明哲保身，适时隐退为上。" },
  "1-8": { name: "天地否", desc: "闭塞不通。上下不合，小人得势，坚守贞固以待黎明。" },
  "2-1": { name: "泽天夬", desc: "决断清除。决而能和，刚柔相济，防小人暗算。" },
  "2-2": { name: "兑为泽", desc: "喜悦交流。丽泽对讲，朋友相帮，言谈有度则吉。" },
  "2-3": { name: "泽火革", desc: "顺天应人。变革创新，改弦更张，大吉可期。" },
  "2-4": { name: "泽雷随", desc: "随遇而安。顺应潮流，择善而从，自得平安。" },
  "2-5": { name: "泽风大过", desc: "栋梁折曲。压力过重，需稳健调节，不可强出头。" },
  "2-6": { name: "泽水困", desc: "穷困坚守. 龙游浅水，坚守正道，岁寒知松柏。" },
  "2-7": { name: "泽山咸", desc: "心灵感应。少男少女，相互吸引，心有灵犀，万事皆吉。" },
  "2-8": { name: "泽地萃", desc: "精英汇聚。萃聚一堂，财源大茂，得众力支持。" },
  "3-1": { name: "火天大有", desc: "日丽中天。大有收获，富足宽容，顺天依时。" },
  "3-2": { name: "火泽睽", desc: "同而不同。求同存异，防背道而驰，以柔克刚。" },
  "3-3": { name: "离为火", desc: "光明附着。明两作照，前途坦荡，宜守中正。" },
  "3-4": { name: "火雷噬嗑", desc: "刚正严明。排除万难，赏罚分明，宜快速决断。" },
  "3-5": { name: "火风鼎", desc: "三足鼎立。协力图新，贤才得用，基业稳固。" },
  "3-6": { name: "火水未济", desc: "黎明前夕。事情尚未完结，虽有困难但大有希望。" },
  "3-7": { name: "火山旅", desc: "羁旅漂泊。不安于室，在外奔波，守正防破财。" },
  "3-8": { name: "火地晋", desc: "旭日东升。仕途坦荡，步步高升，大受器重。" },
  "4-1": { name: "雷天大壮", desc: "声势浩大。阳气鼎盛，防亢龙有悔，宜中庸稳重。" },
  "4-2": { name: "雷泽归妹", desc: "终难长久。防主次颠倒，宜按部就班，不可急躁功利。" },
  "4-3": { name: "雷火丰", desc: "丰盛璀璨。如日中天，宜居安思危，防盛极而衰。" },
  "4-4": { name: "震为雷", desc: "春雷炸响。震惊百里，警醒自修，先惊后喜。" },
  "4-5": { name: "雷风恒", desc: "持之以恒。雷风相助，恒心能成，夫妻和睦。" },
  "4-6": { name: "雷水解", desc: "冰消瓦解。转危为安，排除阻碍，宜快速推进。" },
  "4-7": { name: "雷山小过", desc: "小有过越。宜下不宜上，宜静不宜动，小事能成。" },
  "4-8": { name: "雷地豫", desc: "喜乐安豫。顺时依势，防玩物丧志，宜居安思危。" },
  "5-1": { name: "风天小畜", desc: "密云不雨。蓄积力量，小有收获，耐心等待时机。" },
  "5-2": { name: "风泽中孚", desc: "诚信立身。心中诚信，感化他人，谋望皆能实现。" },
  "5-3": { name: "风火家人", desc: "齐家之道。内政井然，各司其职，家和万事兴。" },
  "5-4": { name: "风雷益", desc: "损上益下。利涉大川，大有作为，天施地生。" },
  "5-5": { name: "巽为风", desc: "顺风渗透。申命行事，随风潜入，宜多用计谋。" },
  "5-6": { name: "风水涣", desc: "冰消瓦解。扬帆起航，消解隔阂，重聚人心。" },
  "5-7": { name: "风山渐", desc: "鸿渐于陆。循序渐进，积少成多，前途不可限量。" },
  "5-8": { name: "风地观", desc: "高瞻远瞩。观摩学习，宜静修反思，以德化人。" },
  "6-1": { name: "水天需", desc: "云行于天。耐心等待，蓄水养息，终能大展宏图。" },
  "6-2": { name: "水泽节", desc: "节制有度。甘节自甘，防奢侈无度，适度调节则吉。" },
  "6-3": { name: "水火既济", desc: "功成圆满。诸事皆顺，宜防备松懈，守成防衰。" },
  "6-4": { name: "水雷屯", desc: "草创维艰。万事开头难，宜广结善缘，积蓄力量。" },
  "6-5": { name: "水风井", desc: "源源不断。养人无方，守常不改，财源细水长流。" },
  "6-6": { name: "坎为水", desc: "重重险陷。常德行进，沉淀心智，必能脱困。" },
  "6-7": { name: "水山蹇", desc: "雪上加霜。前路受阻，宜反求诸己，宜往西南吉。" },
  "6-8": { name: "水地比", desc: "亲密比辅。广结人缘，得众人拥护，先吉后平。" },
  "7-1": { name: "山天大畜", desc: "大有积蓄。藏器于身，广积粮草，大有作为。" },
  "7-2": { name: "山泽损", desc: "损己利人。惩忿窒欲，虽有付出，终能有大报。" },
  "7-3": { name: "山火贲", desc: "文饰装点。白贲无咎，讲求内外兼修，适度包装。" },
  "7-4": { name: "山雷颐", desc: "修身养性。慎言语，节饮食，保重身体则吉。" },
  "7-5": { name: "山风蛊", desc: "推陈出新。整治积弊，勇于自我革新，终能重振旗鼓。" },
  "7-6": { name: "山水蒙", desc: "启蒙发慧。虚心求教，果行育德，渐入佳境。" },
  "7-7": { name: "艮为山", desc: "安如磐石。思不出位，动静得宜，适可而止。" },
  "7-8": { name: "山地剥", desc: "剥落衰退。小人势力上升，宜顺应退守，静待冬去春来。" },
  "8-1": { name: "地天泰", desc: "三阳开泰。上下交泰，诸事顺遂，国泰民安，大吉大利。" },
  "8-2": { name: "地泽临", desc: "大兵临境。亲自督导，防盛极而衰，宜柔中克刚。" },
  "8-3": { name: "地火明夷", desc: "韬光养晦。伤于明处，宜藏锋避祸，心怀正念。" },
  "8-4": { name: "地雷复", desc: "一阳复始。重获新生，循环往复，前景渐渐光明。" },
  "8-5": { name: "地风升", desc: "步步高升。柔顺上升，得贤才提拔，积少成多。" },
  "8-6": { name: "地水师", desc: "行军出征。大众一心，统帅得力，虽有劳累终有成。" },
  "8-7": { name: "地山谦", desc: "虚怀若谷。谦谦君子，卑以自牧，万事皆能化险为夷。" },
  "8-8": { name: "坤为地", desc: "厚德载物。至柔至顺，包容万物，得主有常。" }
}

// 农历年支选项
const lunarYearOptions = [
  { value: 1, label: '子鼠 (1)' }, { value: 2, label: '丑牛 (2)' },
  { value: 3, label: '寅虎 (3)' }, { value: 4, label: '卯兔 (4)' },
  { value: 5, label: '辰龙 (5)' }, { value: 6, label: '巳蛇 (6)' },
  { value: 7, label: '午马 (7)' }, { value: 8, label: '未羊 (8)' },
  { value: 9, label: '申猴 (9)' }, { value: 10, label: '酉鸡 (10)' },
  { value: 11, label: '戌狗 (11)' }, { value: 12, label: '亥猪 (12)' }
]

// 农历时支选项
const lunarHourOptions = [
  { value: 1, label: '子时 23:00~01:00 (1)' }, { value: 2, label: '丑时 01:00~03:00 (2)' },
  { value: 3, label: '寅时 03:00~05:00 (3)' }, { value: 4, label: '卯时 05:00~07:00 (4)' },
  { value: 5, label: '辰时 07:00~09:00 (5)' }, { value: 6, label: '巳时 09:00~11:00 (6)' },
  { value: 7, label: '午时 11:00~13:00 (7)' }, { value: 8, label: '未时 13:00~15:00 (8)' },
  { value: 9, label: '申时 15:00~17:00 (9)' }, { value: 10, label: '酉时 17:00~19:00 (10)' },
  { value: 11, label: '戌时 19:00~21:00 (11)' }, { value: 12, label: '亥时 21:00~23:00 (12)' }
]

// 交互表单及状态
const baziStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const baziBranches = [
  { value: 1, label: '子 (1)' }, { value: 2, label: '丑 (2)' },
  { value: 3, label: '寅 (3)' }, { value: 4, label: '卯 (4)' },
  { value: 5, label: '辰 (5)' }, { value: 6, label: '巳 (6)' },
  { value: 7, label: '午 (7)' }, { value: 8, label: '未 (8)' },
  { value: 9, label: '申 (9)' }, { value: 10, label: '酉 (10)' },
  { value: 11, label: '戌 (11)' }, { value: 12, label: '亥 (12)' }
]

const plumParams = ref({
  type: 'time', // 'time', 'number' 或 'bazi'
  lunarYear: 7,
  lunarMonth: 5,
  lunarDay: 15,
  lunarHour: 7,
  num1: 520,
  num2: 1314,
  num3: null,
  baziInputMode: 'solar', // 'solar' 表示录入生日数字转换，'manual' 表示手动选择干支
  solarYear: 1995,
  solarMonth: 8,
  solarDay: 18,
  solarHour: 12,
  baziYearStem: '甲',
  baziYearBranch: 1,
  baziMonthStem: '丙',
  baziMonthBranch: 3,
  baziDayStem: '戊',
  baziDayBranch: 7,
  baziHourStem: '庚',
  baziHourBranch: 9
})

const branchToValueMap = {
  '子': 1, '丑': 2, '寅': 3, '卯': 4, '辰': 5, '巳': 6,
  '午': 7, '未': 8, '申': 9, '酉': 10, '戌': 11, '亥': 12
}

const stemToElementMap = {
  '甲': { name: '木', polar: '阳', color: '#10b981' },
  '乙': { name: '木', polar: '阴', color: '#10b981' },
  '丙': { name: '火', polar: '阳', color: '#ef4444' },
  '丁': { name: '火', polar: '阴', color: '#ef4444' },
  '戊': { name: '土', polar: '阳', color: '#d97706' },
  '己': { name: '土', polar: '阴', color: '#d97706' },
  '庚': { name: '金', polar: '阳', color: '#64748b' },
  '辛': { name: '金', polar: '阴', color: '#64748b' },
  '壬': { name: '水', polar: '阳', color: '#3b82f6' },
  '癸': { name: '水', polar: '阴', color: '#3b82f6' }
}

const branchToElementMap = {
  '子': { name: '水', color: '#3b82f6' },
  '丑': { name: '土', color: '#d97706' },
  '寅': { name: '木', color: '#10b981' },
  '卯': { name: '木', color: '#10b981' },
  '辰': { name: '土', color: '#d97706' },
  '巳': { name: '火', color: '#ef4444' },
  '午': { name: '火', color: '#ef4444' },
  '未': { name: '土', color: '#d97706' },
  '申': { name: '金', color: '#64748b' },
  '酉': { name: '金', color: '#64748b' },
  '戌': { name: '土', color: '#d97706' },
  '亥': { name: '水', color: '#3b82f6' }
}

const computedConvertedBazi = computed(() => {
  try {
    const y = parseInt(plumParams.value.solarYear) || 1995
    const m = parseInt(plumParams.value.solarMonth) || 8
    const d = parseInt(plumParams.value.solarDay) || 18
    const h = parseInt(plumParams.value.solarHour) || 12
    
    const solar = Solar.fromYmdHms(y, m, d, h, 0, 0)
    const lunar = solar.getLunar()
    const bazi = lunar.getEightChar()
    
    const yg = bazi.getYearGan()
    const yz = bazi.getYearZhi()
    const mg = bazi.getMonthGan()
    const mz = bazi.getMonthZhi()
    const dg = bazi.getDayGan()
    const dz = bazi.getDayZhi()
    const hg = bazi.getTimeGan()
    const hz = bazi.getTimeZhi()
    
    return {
      year: { gan: yg, zhi: yz, ganElement: stemToElementMap[yg], zhiElement: branchToElementMap[yz] },
      month: { gan: mg, zhi: mz, ganElement: stemToElementMap[mg], zhiElement: branchToElementMap[mz] },
      day: { gan: dg, zhi: dz, ganElement: stemToElementMap[dg], zhiElement: branchToElementMap[dz] },
      hour: { gan: hg, zhi: hz, ganElement: stemToElementMap[hg], zhiElement: branchToElementMap[hz] },
      raw: `${yg}${yz} ${mg}${mz} ${dg}${dz} ${hg}${hz}`
    }
  } catch (err) {
    console.error(err)
    return {
      year: { gan: '甲', zhi: '子', ganElement: stemToElementMap['甲'], zhiElement: branchToElementMap['子'] },
      month: { gan: '丙', zhi: '寅', ganElement: stemToElementMap['丙'], zhiElement: branchToElementMap['寅'] },
      day: { gan: '戊', zhi: '午', ganElement: stemToElementMap['戊'], zhiElement: branchToElementMap['午'] },
      hour: { gan: '庚', zhi: '申', ganElement: stemToElementMap['庚'], zhiElement: branchToElementMap['申'] },
      raw: '甲子 丙寅 戊午 庚申'
    }
  }
})

// === 生辰八字全息命理独立模块数据与逻辑 ===
const baziParams = ref({
  solarYear: 1995,
  solarMonth: 8,
  solarDay: 18,
  solarHour: 12
})

const baziDeducing = ref(false)
const baziDeducingStep = ref(0) // 0: 未开始, 1: 动画中, 2: 完成
const baziResult = ref(null)

const baziStemMeta = {
  '甲': { element: '木', polar: '阳' },
  '乙': { element: '木', polar: '阴' },
  '丙': { element: '火', polar: '阳' },
  '丁': { element: '火', polar: '阴' },
  '戊': { element: '土', polar: '阳' },
  '己': { element: '土', polar: '阴' },
  '庚': { element: '金', polar: '阳' },
  '辛': { element: '金', polar: '阴' },
  '壬': { element: '水', polar: '阳' },
  '癸': { element: '水', polar: '阴' }
}

const getTenGod = (dayGan, targetGan) => {
  if (!dayGan || !targetGan) return '比肩'
  const me = baziStemMeta[dayGan]
  const target = baziStemMeta[targetGan]
  if (!me || !target) return '比肩'
  
  const relationMatrix = {
    '木': { '木': '比劫', '火': '食伤', '土': '财星', '金': '官杀', '水': '印星' },
    '火': { '火': '比劫', '土': '食伤', '金': '财星', '水': '官杀', '木': '印星' },
    '土': { '土': '比劫', '金': '食伤', '水': '财星', '木': '官杀', '火': '印星' },
    '金': { '金': '比劫', '水': '食伤', '木': '财星', '火': '官杀', '土': '印星' },
    '水': { '水': '比劫', '木': '食伤', '火': '财星', '土': '官杀', '金': '印星' }
  }
  
  const type = relationMatrix[me.element][target.element]
  const isSamePolar = me.polar === target.polar
  
  const tenGodNames = {
    '比劫': isSamePolar ? '比肩' : '劫财',
    '食伤': isSamePolar ? '食神' : '伤官',
    '财星': isSamePolar ? '偏财' : '正财',
    '官杀': isSamePolar ? '七杀' : '正官',
    '印星': isSamePolar ? '偏印' : '正印'
  }
  
  return tenGodNames[type]
}

const getHideGan = (branch) => {
  const hides = {
    '子': ['癸'],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙'],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '庚', '戊'],
    '午': ['丁', '己'],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛'],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲']
  }
  return hides[branch] || []
}

const getBaziAdvice = (dayGan) => {
  const advices = {
    '甲': {
      title: '甲木命主 · 顶天立地',
      character: '正直善良、极具进取心，拥有领袖气质与栋梁之材。但有时过于固执偏激，不愿妥协。',
      destiny: '如参天大树，生机勃勃。春生则贵，夏生则秀，秋生有成，冬生需阳。一生多得贵人提携，志向高远。',
      advice: '多注意倾听他人意见，凡事留有余地，刚柔并济，运势会更加顺遂。',
      poem: '独木成林壮志扬，直冲云霄立庙堂。柔顺调和纳百川，乾坤稳步福禄长。'
    },
    '乙': {
      title: '乙木命主 · 坚韧秀雅',
      character: '温柔顺从、适应能力强，富有同理心与艺术细胞，具有野草般的坚韧生命力。缺点是容易优柔寡断，依附性强。',
      destiny: '如藤萝花草，灵动蔓延。春光无限，夏火吐秀，秋金修剪，冬水养根。一生人缘极佳，处事圆滑，以柔克刚。',
      advice: '坚定信念，培养独立决断的勇气，遇到困难多相信自己的直觉。',
      poem: '春风野草绿漫天，柔韧随风化险难。立定乾坤求自强，芳华满路福寿全。'
    },
    '丙': {
      title: '丙火命主 · 艳阳高照',
      character: '热情大方、光明磊落、充满活力，乐于助人并极具号召力。缺点是性急如火，缺乏耐性，容易三分钟热度。',
      destiny: '如太阳之火，普照大地。春木生身，夏火炽热（宜水调候），秋金发光，冬水激荡。一生行事光明，事业有开拓性。',
      advice: '修身养性，克制急躁情绪，做事讲求循序渐进与持之以恒。',
      poem: '烈日当空照九天，胸怀坦荡众生怜。中和克制调火气，福泽绵长瑞气缠。'
    },
    '丁': {
      title: '丁火命主 · 烛照幽微',
      character: '温和有礼、心思细腻、内敛且极具奉献精神，照亮他人。缺点是多疑敏感，内心想法不易表露，偶尔感到压抑。',
      destiny: '如人间烛火、星光。春木滋养，夏火帮身，秋金炼铁，冬水衬辉。一生多有特殊才华，适合钻研与谋划。',
      advice: '放宽心胸，凡事不要过多纠结与计较，适时释放内心压力。',
      poem: '一点荧光烛火明，幽微深处见真情。通达明理修慧眼，福禄双全万事兴。'
    },
    '戊': {
      title: '戊土命主 · 重厚宽广',
      character: '沉稳厚重、忠实守信、包容力强，极具信用与原则性。缺点是墨守成规，偶尔显得固执呆板，缺乏变通。',
      destiny: '如泰山之土，能防水能生金。春木克土，夏火生土，秋金泄秀，冬水财旺。一生性格稳健，得人信赖，适合做中流砥柱。',
      advice: '多接受新事物，打破固有习惯，积极主动地进行人际交往。',
      poem: '厚德载物稳如山，万物生生赖此宽。变通革新迎朝旭，乾坤造化福常安。'
    },
    '己': {
      title: '己土命主 · 田园孕育',
      character: '宽容包容、心地善良、多才多艺、乐于奉献与配合。缺点是心思多变，容易妥协，缺乏主见与魄力。',
      destiny: '如湿土田园，善于孕育万物。春水滋润，夏火照暖，秋金吐秀，冬木稳根。一生多为贤内助或核心助手，家庭观念重。',
      advice: '培养独立做决定的勇气，增强自身魄力与领导气场。',
      poem: '田园湿土育英华，温润无声绽万花。坚定刚毅自立志，福运千秋至我家。'
    },
    '庚': {
      title: '庚金命主 · 刚毅果决',
      character: '刚强果断、讲义气、执行力极强、富有正义感与规矩意识。缺点是过于刚硬，说话直接，容易无意中伤害他人。',
      destiny: '如刀剑之金，需要火炼、水泄。春木财旺，夏火淬炼（成器），秋金肃杀，冬水吐秀。一生多能担当重任，杀伐果决。',
      advice: '言语温和一些，学会妥协与以柔克刚，能减少口舌纠纷。',
      poem: '百炼成钢化纯锋，披荆斩棘建奇功。慈悲温润调刚烈，万事亨通福禄融。'
    },
    '辛': {
      title: '辛金命主 · 珠玉温润',
      character: '温润独特、精致追求完美、思维细腻、人际关系体面。缺点是好面子，容易虚荣，内心骄傲，感情多挑剔。',
      destiny: '如金银珠宝，喜壬水淘洗。春木生财，夏火不宜过烈，秋金帮身，冬水澄清。一生气质高雅，多能从事高附加值行业。',
      advice: '脚踏实地，不要过度在意他人眼光，保持朴实豁达的良好心态。',
      poem: '珠玉玲珑照眼明，澄澈淘沙现至真。不逐虚华求实学，福泽深厚保安平。'
    },
    '壬': {
      title: '壬水命主 · 江河奔腾',
      character: '智慧超群、大局观强、有远见与胸怀、适应多变的环境。缺点是情绪起伏大，做事易冲动，奔波不定。',
      destiny: '如江河湖海，滚滚向前。春木泄秀，夏火生财，秋金生水，冬水汹涌（需戊土筑堤）。一生多有大作为，心怀宽广。',
      advice: '做事要专注，切忌虎头蛇尾，同时需要学会自我约束与防范情绪化。',
      poem: '江河大水浩无涯，卷起千重万道花。静水流深修定力，福瑞临门万家达。'
    },
    '癸': {
      title: '癸水命主 · 灵动雨露',
      character: '聪明灵动、温柔细心、富有创意和幻想、直觉极强。缺点是敏感多疑，情绪化严重，容易多愁善感。',
      destiny: '如雨露清泉，滋润万物。春木发芽，夏火解冻，秋金澄清，冬水相融。一生具有极强的艺术天分与玄学直觉。',
      advice: '保持开朗乐观，多接触阳光正能量的活动，少陷入无端焦虑。',
      poem: '清泉雨露润无声，灵动剔透映乾坤。淡泊宁静修心性，福禄自随运自伸。'
    }
  }
  return advices[dayGan] || advices['甲']
}

const calculateBaziDestiny = () => {
  baziDeducing.value = true
  baziDeducingStep.value = 1
  
  setTimeout(() => {
    try {
      const y = parseInt(baziParams.value.solarYear) || 1995
      const m = parseInt(baziParams.value.solarMonth) || 8
      const d = parseInt(baziParams.value.solarDay) || 18
      const h = parseInt(baziParams.value.solarHour) || 12
      
      const solar = Solar.fromYmdHms(y, m, d, h, 0, 0)
      const lunar = solar.getLunar()
      const bazi = lunar.getEightChar()
      
      const yg = bazi.getYearGan()
      const yz = bazi.getYearZhi()
      const mg = bazi.getMonthGan()
      const mz = bazi.getMonthZhi()
      const dg = bazi.getDayGan()
      const dz = bazi.getDayZhi()
      const hg = bazi.getTimeGan()
      const hz = bazi.getTimeZhi()
      
      const elementCounts = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
      
      const addStemElement = (gan) => {
        const meta = baziStemMeta[gan]
        if (meta) elementCounts[meta.element]++
      }
      
      const addBranchElement = (zhi) => {
        const zhiToElement = {
          '子': '水', '亥': '水',
          '寅': '木', '卯': '木',
          '巳': '火', '午': '火',
          '辰': '土', '戌': '土', '丑': '土', '未': '土',
          '申': '金', '酉': '金'
        }
        const el = zhiToElement[zhi]
        if (el) elementCounts[el]++
      }
      
      addStemElement(yg); addStemElement(mg); addStemElement(dg); addStemElement(hg)
      addBranchElement(yz); addBranchElement(mz); addBranchElement(dz); addBranchElement(hz)
      
      const totalCount = 8
      const elementRates = {}
      for (const el in elementCounts) {
        elementRates[el] = Math.round((elementCounts[el] / totalCount) * 100)
      }
      
      let maxEl = '木', minEl = '木'
      let maxVal = -1, minVal = 999
      for (const el in elementCounts) {
        if (elementCounts[el] > maxVal) { maxVal = elementCounts[el]; maxEl = el }
        if (elementCounts[el] < minVal) { minVal = elementCounts[el]; minEl = el }
      }
      
      const yNy = bazi.getYearNaYin()
      const mNy = bazi.getMonthNaYin()
      const dNy = bazi.getDayNaYin()
      const hNy = bazi.getTimeNaYin()
      
      const yearTenGod = getTenGod(dg, yg)
      const monthTenGod = getTenGod(dg, mg)
      const dayTenGod = '日元'
      const hourTenGod = getTenGod(dg, hg)
      
      const adviceInfo = getBaziAdvice(dg)
      
      baziResult.value = {
        solarDate: `${y}年${m}月${d}日 ${h}时`,
        lunarDate: `农历 ${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日`,
        eightCharStr: `${yg}${yz} ${mg}${mz} ${dg}${dz} ${hg}${hz}`,
        columns: [
          { name: '年柱', gan: yg, zhi: yz, nayin: yNy, tenGod: yearTenGod, hideGan: getHideGan(yz), ganElement: stemToElementMap[yg], zhiElement: branchToElementMap[yz] },
          { name: '月柱', gan: mg, zhi: mz, nayin: mNy, tenGod: monthTenGod, hideGan: getHideGan(mz), ganElement: stemToElementMap[mg], zhiElement: branchToElementMap[mz] },
          { name: '日柱', gan: dg, zhi: dz, nayin: dNy, tenGod: dayTenGod, hideGan: getHideGan(dz), ganElement: stemToElementMap[dg], zhiElement: branchToElementMap[dz] },
          { name: '时柱', gan: hg, zhi: hz, nayin: hNy, tenGod: hourTenGod, hideGan: getHideGan(hz), ganElement: stemToElementMap[hg], zhiElement: branchToElementMap[hz] }
        ],
        elementRates,
        elementCounts,
        maxEl,
        minEl,
        advice: adviceInfo
      }
      
      baziDeducingStep.value = 2
    } catch (err) {
      console.error(err)
      baziDeducingStep.value = 0
    } finally {
      baziDeducing.value = false
    }
  }, 1200)
}

const isDeducing = ref(false)
const deducingStep = ref(0) // 0:未开始, 1:动画中, 2:推演完成
const plumResult = ref(null)

// 快捷随机生成数字起卦
const randomizePlumNums = () => {
  plumParams.value.num1 = Math.floor(Math.random() * 9999) + 1
  plumParams.value.num2 = Math.floor(Math.random() * 9999) + 1
  plumParams.value.num3 = Math.floor(Math.random() * 999) + 1
}


// 核心起卦推演逻辑
const calculatePlumBlossom = () => {
  isDeducing.value = true
  deducingStep.value = 1
  
  setTimeout(() => {
    let upperGuaNum = 1
    let lowerGuaNum = 1
    let movingYao = 1 // 1-6 爻

    if (plumParams.value.type === 'time') {
      const year = plumParams.value.lunarYear
      const month = plumParams.value.lunarMonth
      const day = plumParams.value.lunarDay
      const hour = plumParams.value.lunarHour

      // 上卦: (年 + 月 + 日) % 8
      const upSum = year + month + day
      const upRem = upSum % 8
      upperGuaNum = upRem === 0 ? 8 : upRem

      // 下卦: (年 + 月 + 日 + 时) % 8
      const downSum = year + month + day + hour
      const downRem = downSum % 8
      lowerGuaNum = downRem === 0 ? 8 : downRem

      // 动爻: (年 + 月 + 日 + 时) % 6
      const yaoRem = downSum % 6
      movingYao = yaoRem === 0 ? 6 : yaoRem
    } else {
      const n1 = plumParams.value.num1 || 1
      const n2 = plumParams.value.num2 || 1
      const n3 = plumParams.value.num3

      const upRem = n1 % 8
      upperGuaNum = upRem === 0 ? 8 : upRem

      const downRem = n2 % 8
      lowerGuaNum = downRem === 0 ? 8 : downRem

      if (n3 !== undefined && n3 !== null && n3 !== '') {
        const yaoRem = n3 % 6
        movingYao = yaoRem === 0 ? 6 : yaoRem
      } else {
        const yaoRem = (n1 + n2) % 6
        movingYao = yaoRem === 0 ? 6 : yaoRem
      }
    }

    // 1. 本卦合成
    const upGua = baguaBase[upperGuaNum]
    const downGua = baguaBase[lowerGuaNum]
    const benGuaCode = `${upperGuaNum}-${lowerGuaNum}`
    const benGuaInfo = sixtyFourGua[benGuaCode] || { name: '未知卦', desc: '乾坤变通，玄之又玄。' }
    // 数组爻画：下卦在下[0,1,2]，上卦在上[3,4,5]
    const benYao = [...downGua.trigram, ...upGua.trigram]

    // 2. 互卦解算
    // 互卦下卦 = 本卦的 2, 3, 4爻 (索引 1, 2, 3)
    // 互卦上卦 = 本卦的 3, 4, 5爻 (索引 2, 3, 4)
    const huDownTrigram = [benYao[1], benYao[2], benYao[3]]
    const huUpTrigram = [benYao[2], benYao[3], benYao[4]]

    const findBaguaIdByTrigram = (tri) => {
      for (const id in baguaBase) {
        const baseTri = baguaBase[id].trigram
        if (baseTri[0] === tri[0] && baseTri[1] === tri[1] && baseTri[2] === tri[2]) {
          return parseInt(id)
        }
      }
      return 8
    }

    const huLowerGuaNum = findBaguaIdByTrigram(huDownTrigram)
    const huUpperGuaNum = findBaguaIdByTrigram(huUpTrigram)
    const huGuaCode = `${huUpperGuaNum}-${huLowerGuaNum}`
    const huGuaInfo = sixtyFourGua[huGuaCode] || { name: '未知互卦', desc: '事态发展的中间起伏和内因。' }
    const huYao = [...huDownTrigram, ...huUpTrigram]

    // 3. 变卦解算（动爻取反，1变0，0变1，爻为1-indexed，对应索引 movingYao-1）
    const bianYao = [...benYao]
    bianYao[movingYao - 1] = benYao[movingYao - 1] === 1 ? 0 : 1

    const bianDownTrigram = [bianYao[0], bianYao[1], bianYao[2]]
    const bianUpTrigram = [bianYao[3], bianYao[4], bianYao[5]]
    const bianLowerGuaNum = findBaguaIdByTrigram(bianDownTrigram)
    const bianUpperGuaNum = findBaguaIdByTrigram(bianUpTrigram)
    const bianGuaCode = `${bianUpperGuaNum}-${bianLowerGuaNum}`
    const bianGuaInfo = sixtyFourGua[bianGuaCode] || { name: '未知变卦', desc: '事态演变的最终局势和走向。' }

    // 4. 体卦与用卦定位
    // 无动爻为体，有动爻为用。动爻在1-3爻为下卦，动爻在4-6爻为上卦。
    let tiGua = null
    let yongGua = null
    let isTiUp = false

    if (movingYao >= 4) {
      tiGua = downGua // 下卦为体
      yongGua = upGua   // 上卦为用
      isTiUp = false
    } else {
      tiGua = upGua   // 上卦为体
      yongGua = downGua // 下卦为用
      isTiUp = true
    }

    // 5. 体用五行生克研判
    const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }
    const ke = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }

    const tiEl = tiGua.element
    const yongEl = yongGua.element

    let relation = ''
    let relationDesc = ''
    let luckLevel = ''
    let luckDesc = ''

    if (tiEl === yongEl) {
      relation = '比和'
      relationDesc = `体卦【${tiGua.name}金】与用卦【${yongGua.name}金】五行同属【${tiEl}】，比肩并茂。`
      luckLevel = '吉（比和）'
      luckDesc = '体用比和为平稳亨通之象。代表谋事可得平辈、同道或合作伙伴鼎力协作，不偏不倚，稳扎稳打即可成事。'
    } else if (sheng[yongEl] === tiEl) {
      relation = '用生体'
      relationDesc = `用卦之【${yongEl}】生扶体卦之【${tiEl}】。`
      luckLevel = '大吉（生入）'
      luckDesc = '用生体为万事大吉之兆。预示外力大为受益，贵人扶掖，资财与机遇主动送上门来，诸般谋望皆能顺心顺意！'
    } else if (sheng[tiEl] === yongEl) {
      relation = '体生用'
      relationDesc = `体卦之【${tiEl}】泄气生扶用卦之【${yongEl}】。`
      luckLevel = '小凶（生出/泄气）'
      luckDesc = '体生用代表消耗泄气。预示做此事需耗费您极大的精力、物力、财力，容易事倍功半、过度透支。建议防微杜渐，量力而行。'
    } else if (ke[tiEl] === yongEl) {
      relation = '体克用'
      relationDesc = `体卦之【${tiEl}】降服克服用卦之【${yongEl}】。`
      luckLevel = '小吉（克出）'
      luckDesc = '体克用代表所求之事在自身掌控之下。虽然推进过程中伴随诸多竞争与磨难，但最终可通过自身实力克难克坚，夺得胜利果实！'
    } else if (ke[yongEl] === tiEl) {
      relation = '用克体'
      relationDesc = `用卦之【${yongEl}】克制克伤体卦之【${tiEl}】。`
      luckLevel = '大凶（克入/克伤）'
      luckDesc = '用克体为压力重重、行事受阻之象。预示近期易伴随口舌、小人暗箭或财物损耗，压力极大。此时不宜轻率突围，宜静守贞固，韬光养晦。'
    }

    plumResult.value = {
      movingYao,
      tiGua,
      yongGua,
      isTiUp,
      relation,
      relationDesc,
      luckLevel,
      luckDesc,
      ben: {
        code: benGuaCode,
        name: benGuaInfo.name,
        desc: benGuaInfo.desc,
        upGua,
        downGua,
        yao: benYao
      },
      hu: {
        code: huGuaCode,
        name: huGuaInfo.name,
        desc: huGuaInfo.desc,
        upGua: baguaBase[huUpperGuaNum],
        downGua: baguaBase[huLowerGuaNum],
        yao: huYao
      },
      bian: {
        code: bianGuaCode,
        name: bianGuaInfo.name,
        desc: bianGuaInfo.desc,
        upGua: baguaBase[bianUpperGuaNum],
        downGua: baguaBase[bianLowerGuaNum],
        yao: bianYao
      }
    }

    isDeducing.value = false
    deducingStep.value = 2
  }, 1000)
}

// 平滑滚动至梅花易数 Tab
const scrollToPlumBlossom = () => {
  activeTableTab.value = 'plumBlossom'
  setTimeout(() => {
    const el = document.querySelector('.dictionary-tabs')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

// 爻位序号转换中文
const getClerkYaoName = (num) => {
  const names = {
    1: '初爻',
    2: '二爻',
    3: '三爻',
    4: '四爻',
    5: '五爻',
    6: '上爻'
  }
  return names[num] || ''
}

// 根据吉凶等级匹配 CSS 类
const getLuckClass = (level) => {
  if (!level) return 'luck-neutral'
  if (level.includes('大吉')) return 'luck-big-win'
  if (level.includes('大凶')) return 'luck-big-loss'
  if (level.includes('小吉')) return 'luck-small-win'
  if (level.includes('小凶')) return 'luck-small-loss'
  return 'luck-neutral'
}
</script>

<style scoped>
/* ==========================================
   🔮 梅花易数全息起卦推演专属美学样式
   ========================================== */
.plum-main-container {
  margin-top: 24px;
}

.plum-console-col {
  margin-bottom: 20px;
}

.analysis-inner-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
}

.actor-circle-glow {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
}

.actor-symbol {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  transition: all 0.3s ease;
}

.actor-name {
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
  margin: 2px 0 0 0;
  transition: all 0.3s ease;
}

.relation-link-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100px;
  position: relative;
  margin: 0 10px;
  transition: all 0.3s ease;
}

.plum-console-card {
  background: rgba(255, 255, 255, 0.85) !important;
  border: 1px solid rgba(99, 102, 241, 0.15) !important;
  box-shadow: 0 12px 36px rgba(99, 102, 241, 0.06) !important;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
}

.deduce-action-center {
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding-top: 24px;
}

.hexagram-card {
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.3s ease;
}

.hex-lines-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 160px;
  height: 120px;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
  transition: all 0.3s ease;
}

.yao-label-tag {
  position: absolute;
  right: -55px;
  font-size: 10px;
  color: #94a3b8;
  font-weight: 700;
  transition: all 0.3s ease;
}

.moving-dot {
  position: absolute;
  left: -50px;
  font-size: 10px;
  font-weight: 800;
  color: #b45309;
  animation: pulseGlow 1.5s infinite;
  transition: all 0.3s ease;
}

.change-dot {
  position: absolute;
  left: -50px;
  font-size: 10px;
  font-weight: 800;
  color: #059669;
  animation: pulseGlow 1.5s infinite;
  transition: all 0.3s ease;
}

/* Radio Group 拟物玻璃化定制 */
.custom-radio-group {
  background: rgba(0, 0, 0, 0.03);
  padding: 6px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.custom-radio-group :deep(.el-radio-button__inner) {
  border-radius: 12px !important;
  margin: 0 4px;
  border: 1px solid transparent !important;
  background: transparent !important;
  color: #64748b !important;
  font-weight: bold;
  font-size: 13px;
  padding: 8px 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: none !important;
}

.custom-radio-group :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, #1e1b4b, #4c1d95) !important;
  color: #fbbf24 !important;
  border-color: rgba(251, 191, 36, 0.15) !important;
  box-shadow: 0 4px 15px rgba(30, 27, 75, 0.25) !important;
}

/* 输入控件定制 */
.plum-select-full :deep(.el-input__wrapper),
.plum-input-full :deep(.el-input__wrapper) {
  border-radius: 12px !important;
  padding: 8px 12px !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: none !important;
  transition: border-color 0.3s;
}

.plum-select-full :deep(.el-input__wrapper:hover),
.plum-input-full :deep(.el-input__wrapper:hover) {
  border-color: #6366f1 !important;
}

.plum-deduce-big-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(76, 29, 149, 0.35) !important;
  filter: brightness(1.08);
}

.plum-deduce-big-btn:active {
  transform: translateY(0);
}

/* 动爻高亮呼吸特写 */
.hex-yao-line.moving-yao-highlight .yang-bar,
.hex-yao-line.moving-yao-highlight .yin-half {
  animation: pulseMovingYao 2s infinite !important;
}

.hex-yao-line.changed-yao-highlight .yang-bar,
.hex-yao-line.changed-yao-highlight .yin-half {
  animation: pulseChangedYao 2s infinite !important;
}

@keyframes pulseMovingYao {
  0%, 100% {
    box-shadow: 0 0 8px rgba(251, 191, 36, 0.4);
    filter: brightness(1);
  }
  50% {
    box-shadow: 0 0 18px rgba(251, 191, 36, 0.9);
    filter: brightness(1.15);
  }
}

@keyframes pulseChangedYao {
  0%, 100% {
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    filter: brightness(1);
  }
  50% {
    box-shadow: 0 0 18px rgba(16, 185, 129, 0.9);
    filter: brightness(1.15);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.8;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

/* 进度条动画 */
@keyframes loadProgress {
  0% { transform: scaleX(0); }
  50% { transform: scaleX(0.7); }
  100% { transform: scaleX(1); }
}

.spinning-fast {
  animation: spinTaiji 1.2s linear infinite !important;
}

/* 卦卡精美悬浮 */
.hexagram-card {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02) !important;
}

.hexagram-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.06) !important;
  border-color: rgba(99, 102, 241, 0.15) !important;
}

.hex-desc {
  transition: color 0.3s;
}

.hexagram-card:hover .hex-desc {
  color: #334155 !important;
}

/* 平滑跳转按钮 */
.plum-jump-btn {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.plum-jump-btn:hover {
  transform: translateX(4px) scale(1.05);
}

.practice-dictionary {
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px 0 40px 0;
}

.control-row :deep(.flex-column) {
  display: flex !important;
  flex-direction: column;
  gap: 24px;
}

/* 玻璃卡片 */
.glass-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.05);
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
}

/* 修行头图 */
.spiritual-header {
  min-height: 140px;
  background: linear-gradient(135deg, #1e1b4b 0%, #3b0764 50%, #1e1b4b 100%) !important;
  border: 1px solid rgba(245, 158, 11, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 30px 40px;
  margin-bottom: 24px;
  color: white;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.15), transparent 60%);
  pointer-events: none;
}

.header-info {
  z-index: 1;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 15px;
}

.taiji-icon {
  font-size: 2.4rem;
  color: #f59e0b;
  animation: spinTaiji 12s linear infinite;
  display: inline-block;
  line-height: 1;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 2px;
  background: linear-gradient(to right, #ffffff 30%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin-top: 10px;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.search-box {
  z-index: 1;
  width: 320px;
}

.custom-search :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: none !important;
  padding: 8px 16px;
}

.custom-search :deep(.el-input__inner) {
  color: white !important;
}

.custom-search :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.45);
}

.custom-search :deep(.el-input__icon) {
  color: rgba(255, 255, 255, 0.6);
}

/* 控制面板双栏 */
.control-row {
  margin-bottom: 24px;
  display: flex;
  align-items: stretch;
}

/* 卡片标题发光效果 */
.card-glow-title {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 15px;
}

.glow-icon {
  color: #6366f1;
  font-size: 18px;
}

.calculator-card {
  display: flex;
  flex-direction: column;
}

/* 换算推演器内部 */
.calculator-inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.live-clock-section {
  display: flex;
  gap: 15px;
}

.clock-display,
.branch-display {
  flex: 1;
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.clock-display .time-num {
  font-size: 28px;
  font-weight: 800;
  color: #4f46e5;
  font-family: 'Outfit', sans-serif;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.combined-clock-card .branch-paren {
  color: #b45309;
  font-size: 22px;
  font-weight: 800;
  margin-left: 8px;
}

.time-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
  font-weight: 600;
}

/* 模拟控制卡片 */
.simulation-control-card {
  gap: 10px;
  align-items: stretch !important;
}

.sim-header-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sim-title {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.sync-btn-compact {
  font-size: 11px;
  padding: 4px 8px;
  height: auto;
  border-radius: 6px;
}

.sim-body-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.simulation-input-field {
  width: 120px;
}

.sim-unit-text {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

/* 换算详细卡片 */
.branch-detail-panel {
  border-radius: 20px;
  padding: 20px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* 五行风格色彩库 */
.branch-detail-panel.water {
  background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%);
  border-color: #a5f3fc;
}
.branch-detail-panel.wood {
  background: linear-gradient(135deg, #f0fdf4 0%, #f0fdf4 100%);
  border-color: #bbf7d0;
}
.branch-detail-panel.earth {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-color: #fde68a;
}
.branch-detail-panel.flame {
  background: linear-gradient(135deg, #fff5f5 0%, #fff1f2 100%);
  border-color: #fecdd3;
}
.branch-detail-panel.gold {
  background: linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%);
  border-color: #e4e4e7;
}

.detail-badge-row {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

/* 五行Tag定制 */
.element-tag.water { background-color: #0284c7 !important; border-color: #0284c7 !important; }
.element-tag.wood { background-color: #10b981 !important; border-color: #10b981 !important; }
.element-tag.earth { background-color: #d97706 !important; border-color: #d97706 !important; }
.element-tag.flame { background-color: #ef4444 !important; border-color: #ef4444 !important; }
.element-tag.gold { background-color: #71717a !important; border-color: #71717a !important; }

.id-badge {
  font-weight: 700;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-info {
  display: flex;
  align-items: center;
  gap: 18px;
}

.zodiac-pic {
  font-size: 3.2rem;
  background: white;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.info-text h3 {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.modern-time {
  font-size: 13px;
  color: #64748b;
  margin-top: 5px;
  font-weight: 500;
}

.rhyme-box {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-left: 4px solid #f59e0b;
}

.quote-mark {
  font-size: 24px;
  font-weight: bold;
  color: #cbd5e1;
  font-family: Georgia, serif;
  line-height: 1;
}

.rhyme-text {
  font-size: 14px;
  color: #334155;
  font-weight: 600;
}

.midnight-warning {
  margin-top: 10px;
  padding: 10px 14px;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 10px;
  color: #92400e;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.5;
}

/* 起卦计算器 */
.gua-calc-card {
  flex: 1 !important;
  display: flex;
  flex-direction: column;
  margin-top: 0;
}

.gua-calc-card .toolbar-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.gua-calc-inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.calc-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.input-btn-group {
  display: flex;
  gap: 15px;
  align-items: center;
}

.custom-num-input {
  width: 200px !important;
}

.custom-num-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 6px 12px;
}

.magic-btn {
  border-radius: 12px !important;
}

/* 卦象结果卡片 */
.calc-result-panel {
  background: linear-gradient(135deg, #1e1b4b 0%, #111827 100%);
  border-radius: 20px;
  padding: 20px 25px;
  color: white;
  display: flex;
  align-items: center;
  gap: 30px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
}

.gua-trigram-huge {
  font-size: 5.5rem;
  color: #fbbf24;
  font-family: monospace;
  line-height: 1;
  background: rgba(255, 255, 255, 0.04);
  width: 120px;
  height: 120px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(251, 191, 36, 0.15);
}

.gua-result-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gua-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gua-num-badge {
  background: #fbbf24;
  color: #1e1b4b;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 30px;
  text-transform: uppercase;
}

.gua-title-row h2 {
  font-size: 22px;
  font-weight: 800;
  margin: 0;
  letter-spacing: 1px;
}

.gua-element {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.gua-element strong {
  color: #fbbf24;
  font-size: 15px;
}

.gua-code-box {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 13px;
  border-left: 3px solid #fbbf24;
}

.code-title {
  color: rgba(255, 255, 255, 0.5);
}

.code-content {
  color: white;
  font-weight: 600;
}

.zero-note {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.4;
}

.hand-center-taiji {
  background: rgba(99, 102, 241, 0.03);
  border: 1px dashed rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.taiji-mini-spin {
  font-size: 32px;
  color: #cbd5e1;
  animation: spinTaiji 20s linear infinite;
}

.cell-empty-place {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  cursor: default !important;
  pointer-events: none !important;
}

/* 掐指掌法图右栏 */
.hand-card {
  flex: 1 !important;
  display: flex;
  flex-direction: column;
}

.text-center {
  justify-content: center;
}

.hand-description {
  font-size: 13px;
  color: #64748b;
  text-align: center;
  margin-top: -10px;
  margin-bottom: 25px;
}

.hand-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.hand-outline {
  width: 100%;
  max-width: 380px;
  background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08), transparent 70%);
  border: 2px solid rgba(99, 102, 241, 0.1);
  border-radius: 40px;
  padding: 30px 20px 20px 20px;
  position: relative;
}

.finger-labels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  margin-bottom: 12px;
}

.label-item {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
}

.finger-joints-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 12px;
}

.joint-cell {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}

.joint-cell:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

.joint-cell.active {
  background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%) !important;
  border-color: #f59e0b !important;
  color: white !important;
  box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3) !important;
  transform: scale(1.08);
  z-index: 2;
}

.joint-name {
  font-size: 18px;
  font-weight: 800;
}

.joint-cell.active .joint-name {
  color: #fbbf24;
}

.joint-pinyin {
  font-size: 10px;
  color: #64748b;
  margin-top: 2px;
}

.joint-cell.active .joint-pinyin {
  color: rgba(255,255,255,0.6);
}

.joint-badge {
  font-size: 8px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 4px;
  margin-top: 4px;
}

.joint-badge.water { background-color: #e0f2fe; color: #0284c7; }
.joint-badge.earth { background-color: #fef3c7; color: #b45309; }
.joint-badge.wood { background-color: #dcfce7; color: #15803d; }
.joint-badge.flame { background-color: #fee2e2; color: #b91c1c; }
.joint-badge.gold { background-color: #f4f4f5; color: #4b5563; }

.joint-cell.active .joint-badge {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
}

/* 掌心渲染 */
.palm-center {
  background: rgba(99, 102, 241, 0.03);
  border: 1px dashed rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.taiji-spinner {
  font-size: 32px;
  color: #cbd5e1;
  animation: spinTaiji 20s linear infinite;
}

.palm-text {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 700;
}

.tip-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 14px 18px;
  font-size: 12px;
  color: #475569;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.tip-card .el-icon {
  font-size: 16px;
  color: #f59e0b;
  margin-top: 2px;
}

/* 数据映射表展示区 */
.tables-section-card {
  padding: 30px;
}

.table-intro {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
  background: #f8fafc;
  padding: 10px 18px;
  border-radius: 10px;
  border-left: 3px solid #cbd5e1;
}

/* Tab 样式定制 */
.tab-label-custom {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.tab-badge-num {
  background: #f1f5f9;
  color: #64748b;
  font-size: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-tabs__item.is-active .tab-badge-num {
  background: #6366f1;
  color: white;
}

/* 表一 地支卡片网格 */
.branches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.branch-card-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 16px 20px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
}

.branch-card-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 18px rgba(0,0,0,0.04);
}

.branch-card-item.highlighted {
  border-color: #f59e0b !important;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2), 0 10px 20px rgba(0,0,0,0.05) !important;
  background: #fffcf0;
}

.item-id-badge {
  position: absolute;
  top: 12px;
  right: 15px;
  font-size: 10px;
  font-weight: 800;
  color: #94a3b8;
}

.item-main-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 5px;
}

.item-name {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
}

.item-pinyin {
  font-size: 12px;
  color: #64748b;
}

.item-zodiac-tag {
  font-size: 11px;
  font-weight: 700;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 30px;
  color: #475569;
  margin-left: auto;
}

.item-details-row {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
}

.detail-sub {
  display: flex;
  flex-direction: column;
}

.detail-sub .lbl {
  font-size: 10px;
  color: #94a3b8;
  font-weight: bold;
}

.detail-sub .val {
  font-size: 12px;
  color: #475569;
  margin-top: 2px;
  font-weight: 600;
}

.bold-val {
  font-weight: bold !important;
}

/* 颜色高亮类别 */
.branch-card-item.water .bold-val { color: #0284c7; }
.branch-card-item.wood .bold-val { color: #10b981; }
.branch-card-item.earth .bold-val { color: #d97706; }
.branch-card-item.flame .bold-val { color: #ef4444; }
.branch-card-item.gold .bold-val { color: #71717a; }

.item-desc-bubble {
  margin-top: 10px;
  background: #f8fafc;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

/* 表二 时辰网格（两行显示） */
.hours-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

@media (min-width: 992px) {
  .plum-console-col {
    margin-bottom: 0 !important;
  }
  .plum-main-container > .el-row {
    display: flex !important;
    align-items: stretch !important;
  }
  .plum-main-container > .el-row > .el-col {
    display: flex !important;
    flex-direction: column !important;
  }
  .plum-display-section {
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
  }
  .plum-empty-card, .plum-loading-card {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    height: 100% !important;
  }
  .hexagram-card {
    padding: 24px 12px !important;
  }
  .hex-lines-container {
    max-width: 110px !important;
  }
  .yao-label-tag {
    right: -38px !important;
  }
  .moving-dot, .change-dot {
    left: -38px !important;
  }
}

@media (max-width: 992px) {
  .analysis-inner-grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }
}

@media (max-width: 1200px) {
  .hours-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 768px) {
  .hours-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .plum-display-section {
    margin-top: 20px !important;
  }
  .actor-circle-glow {
    width: 68px !important;
    height: 68px !important;
  }
  .actor-symbol {
    font-size: 22px !important;
  }
  .actor-name {
    font-size: 12px !important;
  }
  .relation-link-arrow {
    width: 60px !important;
    margin: 0 5px !important;
  }
  .arrow-relation-badge {
    font-size: 9.5px !important;
    padding: 2px 6px !important;
  }
}
@media (max-width: 480px) {
  .hours-grid {
    grid-template-columns: 1fr;
  }
}

.hour-grid-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.hour-grid-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 18px rgba(99, 102, 241, 0.08);
  border-color: #6366f1;
}

.hour-grid-item.highlighted {
  background: #f5f3ff;
  border-color: #818cf8 !important;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.1) !important;
}

.hour-time-header {
  font-size: 13px;
  font-weight: 800;
  color: #4f46e5;
  font-family: 'Outfit', sans-serif;
  text-align: center;
  background: rgba(99, 102, 241, 0.06);
  padding: 4px 8px;
  border-radius: 8px;
  letter-spacing: 0.5px;
}

.hour-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.hour-title {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.hour-zodiac-tag {
  font-size: 12px;
  font-weight: 700;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 30px;
  color: #475569;
}

.hour-grid-item.highlighted .hour-zodiac-tag {
  background: #fff;
}

.hour-badge-row {
  display: flex;
  gap: 5px;
}

.hour-slogan-box {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 8px;
  line-height: 1.4;
  flex: 1;
  display: flex;
  align-items: center;
}

.hour-grid-item.highlighted .hour-slogan-box {
  background: rgba(255, 255, 255, 0.7);
}

/* 表三 八卦网格 */
.bagua-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.bagua-card-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 20px 24px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bagua-card-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.05);
}

.bagua-card-item.highlighted {
  border-color: #fbbf24 !important;
  background: #fffdf5;
  box-shadow: 0 12px 24px rgba(251,191,36,0.15);
}

.gua-id-badge {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 2px 10px;
  border-radius: 30px;
}

.bagua-card-item.highlighted .gua-id-badge {
  background: #fbbf24;
  color: #1e1b4b;
}

.gua-symbol-large {
  font-size: 3.5rem;
  color: #cbd5e1;
  font-family: monospace;
  line-height: 1;
  transition: color 0.3s;
}

.bagua-card-item:hover .gua-symbol-large,
.bagua-card-item.highlighted .gua-symbol-large {
  color: #f59e0b;
}

.gua-meta h3 {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.gua-nature {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  display: block;
  margin-top: 4px;
}

.gua-code-detail {
  background: #f8fafc;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
  font-weight: 500;
  border-left: 3px solid #cbd5e1;
}

.bagua-card-item.highlighted .gua-code-detail {
  background: #fffbeb;
  border-left-color: #fbbf24;
}

/* 底部工具栏样式 */
.bottom-toolbar {
  margin-top: 24px;
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.8) !important;
}

.toolbar-header {
  margin-bottom: 12px;
}

.toolbar-header .card-glow-title {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.toolbar-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
}

.toolbar-input-area {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.toolbar-result-panel {
  flex: 1;
  min-width: 320px;
  background: linear-gradient(135deg, #1e1b4b 0%, #111827 100%);
  border-radius: 16px;
  padding: 12px 24px;
  color: white;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.toolbar-gua-trigram {
  font-size: 3.5rem;
  color: #fbbf24;
  font-family: monospace;
  line-height: 1;
  background: rgba(255, 255, 255, 0.04);
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(251, 191, 36, 0.15);
  flex-shrink: 0;
}

.toolbar-gua-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gua-info-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.gua-info-row .gua-element {
  margin: 0;
}

.gua-info-row .gua-code-box {
  padding: 4px 10px;
  font-size: 12px;
  margin: 0;
}

/* 动效 */
@keyframes spinTaiji {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-breath {
  animation: breathGua 4s ease-in-out infinite;
}

@keyframes breathGua {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(251, 191, 36, 0);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
    border-color: rgba(251, 191, 36, 0.4);
  }
}

/* ==========================================================================
   先天八卦太极方位图 (Diagram Tab Styles)
   ========================================================================== */
.diagram-tab-wrapper {
  display: flex;
  gap: 32px;
  margin-top: 24px;
  align-items: stretch;
  min-height: 480px;
}

/* 左侧太极盘列 */
.bagua-plate-col {
  flex: 0 0 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.45);
  border-radius: 24px;
  padding: 30px 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.bagua-plate-outer-container {
  width: 360px;
  height: 360px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 太极盘主 SVG 旋转动画 */
.bagua-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  transform-origin: 200px 200px;
}

.bagua-svg.spinning-slowly {
  animation: spinTaijiPlate 60s linear infinite;
}

.bagua-svg:hover {
  animation-play-state: paused !important;
}

@keyframes spinTaijiPlate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* SVG 几何线条 */
.bagua-octagon-border {
  fill: rgba(255, 255, 255, 0.65);
  stroke: #fbbf24;
  stroke-width: 2;
  stroke-linejoin: round;
  filter: drop-shadow(0 4px 10px rgba(245, 158, 11, 0.15));
  transition: all 0.3s ease;
}

.bagua-octagon-inner {
  fill: none;
  stroke: rgba(251, 191, 36, 0.55);
  stroke-width: 1.2;
  stroke-linejoin: round;
  stroke-dasharray: 4 4;
}

.bagua-center-circle {
  fill: none;
  stroke: #fbbf24;
  stroke-width: 2;
  filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.1));
}

/* 扇区交互填充 */
.bagua-sector-group {
  cursor: pointer;
  transition: all 0.3s ease;
}

.wedge-bg {
  fill: transparent;
  transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bagua-sector-group:hover .wedge-bg {
  fill: var(--hover-color);
  opacity: 0.08;
}

.bagua-sector-group.active .wedge-bg {
  fill: var(--hover-color);
  opacity: 0.15;
}

.radial-line {
  stroke: rgba(251, 191, 36, 0.4);
  stroke-width: 1;
  stroke-dasharray: 2 3;
}

/* 卦象符号与英文方向 */
.trigram-symbol {
  font-size: 32px;
  font-weight: 800;
  text-anchor: middle;
  dominant-baseline: central;
  cursor: pointer;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.08));
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: 200px 70px;
}

.bagua-sector-group:hover .trigram-symbol {
  transform: scale(1.18);
  filter: drop-shadow(0 0 10px var(--hover-color));
}

.bagua-sector-group.active .trigram-symbol {
  transform: scale(1.22);
  filter: drop-shadow(0 0 12px var(--hover-color));
}

.trigram-direction-eng {
  font-size: 9px;
  font-weight: 800;
  text-anchor: middle;
  letter-spacing: 0.8px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.bagua-sector-group:hover .trigram-direction-eng {
  opacity: 0.95;
  font-weight: 900;
}

/* 中心独立旋转太极图 */
.taiji-center-group {
  transform-origin: 200px 200px;
  animation: spinTaijiCenter 15s linear infinite;
  cursor: pointer;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

@keyframes spinTaijiCenter {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 水平不旋转的中文卦字 */
.bagua-name-static {
  cursor: pointer;
  transition: all 0.3s ease;
}

.trigram-chinese-char {
  font-size: 17px;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.bagua-name-static:hover .trigram-chinese-char {
  transform: scale(1.25);
  filter: drop-shadow(0 0 8px var(--active-color));
}

.bagua-name-static.active .trigram-chinese-char {
  transform: scale(1.35);
  font-size: 19px;
  filter: drop-shadow(0 0 12px var(--active-color));
  font-weight: 900;
}

/* 旋转控制栏 */
.rotate-control-bar {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.control-tip {
  font-size: 12px;
  color: #64748b;
  text-align: center;
  font-style: italic;
  opacity: 0.85;
}

/* 右侧全息解读大卡 */
.bagua-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hologram-gua-detail {
  flex: 1;
  background: rgba(255, 255, 255, 0.88) !important;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 20px 45px -12px rgba(0, 0, 0, 0.06) !important;
  border-radius: 28px;
  padding: 36px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  overflow: hidden;
}

.hologram-gua-detail::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: var(--detail-theme-color);
  border-radius: 28px 28px 0 0;
  transition: background 0.4s ease;
}

.hologram-header {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 28px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.06);
  padding-bottom: 24px;
}

.hologram-symbol-box {
  width: 88px;
  height: 88px;
  background: var(--detail-theme-color);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px var(--detail-theme-color);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.hologram-gua-detail:hover .hologram-symbol-box {
  transform: translateY(-4px) rotate(5deg);
  box-shadow: 0 15px 30px -5px var(--detail-theme-color);
}

.symbol-large {
  font-size: 3.5rem;
  color: white;
  line-height: 1;
  font-weight: 800;
}

.hologram-title-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gua-fullname {
  font-size: 26px;
  font-weight: 900;
  color: #0f172a;
  margin: 0;
  letter-spacing: 1px;
}

.gua-meta-badges {
  display: flex;
  gap: 12px;
  align-items: center;
}

.gua-val-badge {
  border-color: #fbbf24 !important;
  color: #b45309 !important;
  font-weight: 800;
  background: #fffbeb !important;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 6px;
}

/* 全息信息网格 */
.hologram-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hologram-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  background: rgba(0, 0, 0, 0.015);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.025);
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.grid-item:last-child {
  border-right: none;
}

.grid-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.grid-value {
  font-size: 15px;
  color: #1e293b;
  font-weight: 800;
}

/* 象解详情描述 */
.hologram-description-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hologram-description-section h4 {
  font-size: 15px;
  font-weight: 800;
  color: #334155;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.hologram-description-section h4::before {
  content: '⚡';
  color: #fbbf24;
}

.gua-meaning-desc {
  font-size: 14.5px;
  line-height: 1.7;
  color: #334155;
  background: #f8fafc;
  padding: 20px 24px;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  margin: 0;
  text-indent: 2em;
  min-height: 100px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.01);
}

.hologram-action-box {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

.sync-gua-btn {
  border-radius: 14px;
  font-weight: 800;
  font-size: 14px;
  padding: 14px 28px !important;
  height: auto !important;
  color: white !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none;
}

.sync-gua-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
  filter: brightness(1.05);
}

.sync-gua-btn:active {
  transform: translateY(-1px);
}

/* ==========================================================================
   传统地支掌诀大图弹窗与按钮 (Traditional Hand Modal & Button)
   ========================================================================== */
.hand-diagram-btn {
  background: linear-gradient(135deg, #fbbf24, #d97706) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 4px 10px rgba(217, 119, 6, 0.25) !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
}

.hand-diagram-btn:hover {
  transform: scale(1.18) rotate(15deg);
  box-shadow: 0 6px 15px rgba(217, 119, 6, 0.4) !important;
}

.hand-diagram-btn:active {
  transform: scale(0.92);
}

/* 对话框全息玻璃拟物风格由全局样式定义在下方 */
</style>

<style>
/* ==========================================================================
   全局传统地支掌诀弹窗样式 (Global Dialog Styles for append-to-body)
   ========================================================================== */
.traditional-hand-dialog {
  border-radius: 28px !important;
  background: rgba(255, 255, 255, 0.94) !important;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.22) !important;
  overflow: hidden !important;
}

.traditional-hand-dialog .el-dialog__header {
  margin-right: 0 !important;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.08) !important;
  padding: 24px 24px 16px 24px !important;
}

.traditional-hand-dialog .el-dialog__title {
  font-weight: 900 !important;
  color: #0f172a !important;
  font-size: 20px !important;
  letter-spacing: 0.5px !important;
}

.traditional-hand-dialog .el-dialog__body {
  padding: 24px !important;
}

.dialog-img-container {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 20px !important;
}

.traditional-hand-img {
  max-width: 100% !important;
  max-height: 280px !important;
  border-radius: 20px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
  border: 5px solid white !important;
  transition: all 0.4s ease !important;
}

.traditional-hand-img:hover {
  transform: scale(1.03) translateY(-2px) !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15) !important;
}

.traditional-hand-tip {
  font-size: 13.5px !important;
  line-height: 1.7 !important;
  color: #334155 !important;
  background: rgba(251, 191, 36, 0.06) !important;
  border: 1px solid rgba(251, 191, 36, 0.15) !important;
  padding: 18px !important;
  border-radius: 16px !important;
  text-align: justify !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

@media (max-width: 768px) {
  .practice-dictionary-view {
    padding: 10px;
  }
  .diagram-tab-wrapper {
    flex-direction: column !important;
    align-items: center !important;
    gap: 20px !important;
  }
  .bagua-plate-col {
    flex: 0 0 auto !important;
    width: 100% !important;
    max-width: 100% !important;
    padding: 15px !important;
    box-sizing: border-box;
  }
  .bagua-plate-outer-container {
    width: 280px !important;
    height: 280px !important;
  }
  .toolbar-body {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 15px !important;
  }
  .toolbar-input-area {
    width: 100% !important;
    justify-content: center !important;
  }
  .toolbar-result-panel {
    min-width: 100% !important;
    box-sizing: border-box;
  }
  
  /* 移动端三大手掌自适应优化 */
  .hand-outline {
    padding: 20px 10px 15px 10px !important;
    max-width: 340px !important;
  }
  .finger-joints-grid {
    gap: 8px !important;
  }
  .joint-cell {
    padding: 8px 4px !important;
    border-radius: 10px !important;
  }
  .joint-name {
    font-size: 15px !important;
  }
  .joint-pinyin {
    font-size: 9px !important;
    margin-top: 1px !important;
  }
  .joint-badge {
    font-size: 8px !important;
    padding: 1px 3px !important;
    margin-top: 2px !important;
  }
  .taiji-mini-spin {
    font-size: 24px !important;
  }
  .branch-detail-panel {
    padding: 15px !important;
    border-radius: 16px !important;
  }
  .zodiac-pic {
    width: 54px !important;
    height: 54px !important;
    font-size: 2rem !important;
  }
  .info-text h3 {
    font-size: 16px !important;
  }
}
</style>
