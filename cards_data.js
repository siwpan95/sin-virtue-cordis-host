/* ============================================================
 * 12 张事件卡数据（cards_data.js）
 * 由 gen_cards.js 自动生成 —— 请勿手动修改结构，改 gen_cards.js 后重新生成
 * 对齐《前端开发需求规格》2.1：CardConfig / ChoiceBranch / Effect
 * 权重口径：0-100 级（原始 0-10 级值 ×6，方向不变）
 * ============================================================ */
module.exports = [
  {
    "cardId": "01",
    "chapter": "Ch1",
    "perspective": "执政厅",
    "type": "normal",
    "typeLabel": "开局 · 立场定调",
    "scene": "你刚坐上王座，前朝唯一的血脉被押上来。满殿贵族等着你表态——赦免，还是赐死。",
    "shots": [
      {
        "shot": "Shot 01",
        "text": "俯视王座厅，烛火摇曳。字幕：「加冕夜。第一道裁决。」"
      },
      {
        "shot": "Shot 02",
        "text": "前朝公主跪在台阶下，抬头看你，眼神平静得可怕。"
      },
      {
        "shot": "Shot 03",
        "text": "大祭司低声：「陛下，她是最后一个。」倒计时出现。"
      }
    ],
    "options": {
      "L": {
        "text": "抬手赦免",
        "consequence": "她抬头，眼里没有感激，只有「我会记住今天」。全场静默。→ 解锁「复仇线」；标记 仁慈",
        "effects": [
          {
            "axis": "devotion",
            "delta": 72
          },
          {
            "axis": "ambition",
            "delta": -42
          },
          {
            "var": "flag",
            "value": "mercy"
          }
        ]
      },
      "R": {
        "text": "亲手赐死",
        "consequence": "你接过酒杯递过去。她喝下，全场寂静，然后爆发出欢呼。→ 解锁「暴君线」；标记 冷酷",
        "effects": [
          {
            "axis": "ambition",
            "delta": 72
          },
          {
            "axis": "devotion",
            "delta": -42
          },
          {
            "var": "flag",
            "value": "cruelty"
          }
        ]
      }
    },
    "audio": {
      "BGM": "低频 drone 转肃穆合唱",
      "SFX": "L=布料摩挲/远雷, R=杯盏轻碰/欢呼爆发",
      "vibration": "R侧杯盏触碰30ms"
    },
    "next": {
      "default": "card02"
    },
    "checklist": [
      "无正确选项，立场即刻可见",
      "后果不可逆，不用数字替代画面"
    ]
  },
  {
    "cardId": "02",
    "chapter": "Ch1",
    "perspective": "回廊",
    "type": "normal",
    "typeLabel": "开局 · 义气代价",
    "scene": "你的发小浑身是血地敲门。他杀了人，尸体在巷子里，求你帮他埋了。",
    "shots": [
      {
        "shot": "Shot 01",
        "text": "雨夜回廊，敲门声急促。字幕：「他浑身是血。」"
      },
      {
        "shot": "Shot 02",
        "text": "发小瘫坐在地：「就这一次，帮我。」"
      },
      {
        "shot": "Shot 03",
        "text": "你低头看自己的手。选项出现。"
      }
    ],
    "options": {
      "L": {
        "text": "帮他埋尸",
        "consequence": "沉默地挖完。他握你的手：「我早知道你会帮。」→ 获得秘密「共犯」；后续他可能顶罪或反咬。标记 义气",
        "effects": [
          {
            "axis": "devotion",
            "delta": 42
          },
          {
            "axis": "ambition",
            "delta": -30
          },
          {
            "var": "flag",
            "value": "accomplice"
          }
        ]
      },
      "R": {
        "text": "绑了送官",
        "consequence": "他临走前笑：「我早知道你会这样。」→ 所有旧关系 trust 归零。标记 冷酷",
        "effects": [
          {
            "axis": "ambition",
            "delta": 48
          },
          {
            "axis": "devotion",
            "delta": -60
          },
          {
            "var": "flag",
            "value": "betray"
          }
        ]
      }
    },
    "audio": {
      "BGM": "雨声 + 低弦",
      "SFX": "L=泥土/喘息, R=铁链/冷笑",
      "vibration": "无"
    },
    "next": {
      "default": "card03",
      "R": "card11_betray"
    },
    "checklist": [
      "L不是美德而是一起下地狱",
      "埋下共犯秘密，供终章翻旧账"
    ]
  },
  {
    "cardId": "03",
    "chapter": "Ch2",
    "perspective": "议事厅",
    "type": "normal",
    "typeLabel": "戏剧瞬间 · 名场面",
    "scene": "下属当众说你「配不上这顶王冠」。满朝文武都听到了，他没拔刀，但比拔刀更狠。",
    "shots": [
      {
        "shot": "Shot 01",
        "text": "议事厅死寂。字幕：「他没拔刀，但比拔刀更狠。」"
      },
      {
        "shot": "Shot 02",
        "text": "下属直视你：「你配不上。」"
      },
      {
        "shot": "Shot 03",
        "text": "文武百官低头，偷瞄你的反应。"
      }
    ],
    "options": {
      "L": {
        "text": "当众扇他耳光，继续议事",
        "consequence": "他低头，但当晚你在枕头下发现一根针。→ 解锁「暗杀线」",
        "effects": [
          {
            "axis": "impulse",
            "delta": 60
          },
          {
            "axis": "ambition",
            "delta": -48
          },
          {
            "var": "flag",
            "value": "assassin"
          }
        ]
      },
      "R": {
        "text": "割掌立誓",
        "consequence": "「你说得对。」你拔剑割破手掌，血滴王座：「那我就用血坐稳它。」全场跪下。→ 解锁「疯王线」",
        "effects": [
          {
            "axis": "ambition",
            "delta": 84
          },
          {
            "axis": "impulse",
            "delta": 36
          },
          {
            "var": "flag",
            "value": "mad_king"
          }
        ]
      }
    },
    "audio": {
      "BGM": "R=心跳+定音鼓渐强",
      "SFX": "L=耳光清脆, R=剑鸣+血滴",
      "vibration": "R侧强震200ms"
    },
    "next": {
      "default": "card04",
      "L": "card11_assassin"
    },
    "checklist": [
      "R是爽文时刻但有代价(所有人开始怕你)",
      "L常规但埋定时炸弹"
    ]
  },
  {
    "cardId": "04",
    "chapter": "Ch2",
    "perspective": "深夜",
    "type": "normal",
    "typeLabel": "两难 · 无好选项",
    "scene": "情人说怀了你的孩子。你清楚自己从未碰过她。她知道你知道。",
    "shots": [
      {
        "shot": "Shot 01",
        "text": "深夜寝殿，她站在床边。字幕：「你从未碰过她。」"
      },
      {
        "shot": "Shot 02",
        "text": "她抚着肚子，笑得很平静。"
      },
      {
        "shot": "Shot 03",
        "text": "你意识到：她在赌你会承认。"
      }
    ],
    "options": {
      "L": {
        "text": "当众承认「是我的」",
        "consequence": "她笑了，那种赢了的笑。→ 后续不断索要权力。标记 窝囊",
        "effects": [
          {
            "axis": "devotion",
            "delta": -42
          },
          {
            "axis": "ambition",
            "delta": -30
          },
          {
            "var": "flag",
            "value": "cuckold"
          }
        ]
      },
      "R": {
        "text": "当众撕开她的谎言",
        "consequence": "她羞愤跑走，三天后你收到她的尸体。→ 解锁「连环复仇线」",
        "effects": [
          {
            "axis": "impulse",
            "delta": 72
          },
          {
            "axis": "ambition",
            "delta": 48
          },
          {
            "var": "flag",
            "value": "revenge"
          }
        ]
      }
    },
    "audio": {
      "BGM": "L=钢琴单音/压抑, R=弦乐下滑+玻璃碎",
      "SFX": "L=布料撕裂, R=人群哗然",
      "vibration": "R侧中震120ms"
    },
    "next": {
      "default": "card05",
      "R": "card08_revenge"
    },
    "checklist": [
      "没有好选项：左窝囊右残忍",
      "让玩家选一个至少爽的"
    ]
  },
  {
    "cardId": "05",
    "chapter": "Ch3",
    "perspective": "团队",
    "type": "qte",
    "typeLabel": "QTE · 8s · 一致性校验",
    "scene": "七个人，三天路程，一份口粮。雾林深处，没人说话，所有人都看着你——唯一的决策者。",
    "qteMs": 8000,
    "shots": [
      {
        "shot": "Shot 01",
        "text": "黑屏。风声与压抑的咳嗽。字幕：「第三天。只剩一袋口粮。」"
      },
      {
        "shot": "Shot 02",
        "text": "俯视全景：7 个剪影在雾中，你（高亮）在前方。"
      },
      {
        "shot": "Shot 03",
        "text": "最弱的少女（小满）抬头看你，嘴唇干裂。"
      },
      {
        "shot": "Shot 04",
        "text": "你低头看干粮包。倒计时出现。字幕：「你要怎么分？」"
      }
    ],
    "options": {
      "L": {
        "text": "掰开，分给所有人",
        "consequence": "每人一口，不够。第二天小满咳血，却把分到的碎屑让给旁边的小孩。字幕：「你守住了一些，也失去了一些。」",
        "effects": [
          {
            "axis": "possession",
            "delta": -36
          },
          {
            "axis": "devotion",
            "delta": 84
          },
          {
            "var": "flag",
            "value": "sacrifice"
          }
        ]
      },
      "R": {
        "text": "自己吃了，看着他们饿",
        "consequence": "大壮扑过来抢——你掏出暗藏的刀捅穿他。血溅在雾里，其余人后退一步。字幕：「你活下来了，代价是不再是他们的同伴。」",
        "effects": [
          {
            "axis": "possession",
            "delta": 84
          },
          {
            "axis": "devotion",
            "delta": -18
          },
          {
            "var": "blood",
            "delta": -1
          }
        ]
      }
    },
    "audio": {
      "BGM": "低频 drone，选择后 L=弦乐上行(悲悯) / R=低音弦震(压迫)",
      "SFX": "咳嗽(L)、刀入肉闷响(R)、心跳骤停(R)",
      "vibration": "R侧刀刺强震200ms；最后2秒每0.5秒轻震"
    },
    "consistency": {
      "pairWith": "card09",
      "axis": "devotion",
      "note": "卡05测本能(牺牲/占有)，卡09测认知理想；若05=R且09=L标记conflict"
    },
    "next": {
      "default": "card06",
      "condition": {
        "R_and_bloodLeq": 4,
        "target": "card11_key"
      }
    },
    "checklist": [
      "QTE超时默认记R(犹豫=自私)",
      "后果不可逆+视觉化(不用数字)",
      "reactionMs<1.5s本能/≥4s深思，计入内耗指数(仅供叙事)"
    ]
  },
  {
    "cardId": "06",
    "chapter": "Ch3",
    "perspective": "古宅",
    "type": "normal",
    "typeLabel": "信息不对称 · 校验卡",
    "scene": "你发现队友中有人是内鬼。证据指向两个人，但你只有时间审一个。",
    "shots": [
      {
        "shot": "Shot 01",
        "text": "古宅地下室，两张椅子。字幕：「只有一个是内鬼。」"
      },
      {
        "shot": "Shot 02",
        "text": "A 在左，低头发抖；B 在右，眼神躲闪。"
      },
      {
        "shot": "Shot 03",
        "text": "沙漏翻倒，时间不多了。"
      }
    ],
    "options": {
      "L": {
        "text": "审 A",
        "consequence": "A 清白，被你逼疯跳窗死了。真内鬼 B 在角落冷笑。→ blood -1；B 后续出卖你。",
        "effects": [
          {
            "axis": "devotion",
            "delta": 30
          },
          {
            "axis": "impulse",
            "delta": 24
          },
          {
            "var": "blood",
            "delta": -1
          }
        ]
      },
      "R": {
        "text": "审 B",
        "consequence": "B 崩溃招了，你当众处决他。但 A 其实也参与了——只是没被抓。→ A 会在终章背刺。",
        "effects": [
          {
            "axis": "impulse",
            "delta": 48
          },
          {
            "axis": "devotion",
            "delta": -48
          },
          {
            "var": "flag",
            "value": "half_blind"
          }
        ]
      }
    },
    "audio": {
      "BGM": "滴答+悬疑弦乐",
      "SFX": "L=开窗风声/冷笑, R=招供抽泣/终章暗示",
      "vibration": "无"
    },
    "consistency": {
      "note": "与卡03同源，测克制/冲动轴，一致性校验"
    },
    "next": {
      "default": "card07"
    },
    "checklist": [
      "信息不对称制造焦虑",
      "无论选哪个都有代价(激发重玩)"
    ]
  },
  {
    "cardId": "07",
    "chapter": "Ch3",
    "perspective": "船舱",
    "type": "qte",
    "typeLabel": "QTE · 6s · 救谁困境",
    "scene": "A 与 B 拔刀相向，你只有一把枪。A 是你兄弟，B 握着通关钥匙。两人都要死。",
    "qteMs": 6000,
    "shots": [
      {
        "shot": "Shot 01",
        "text": "摇晃的船舱，A 与 B 对峙。字幕：「只有一把枪，两人都要死。」"
      },
      {
        "shot": "Shot 02",
        "text": "A 看你：「兄弟，别。」"
      },
      {
        "shot": "Shot 03",
        "text": "B 握紧钥匙。倒计时出现。"
      }
    ],
    "options": {
      "L": {
        "text": "开枪打 A",
        "consequence": "B 愣了，把钥匙给你。A 死前说「早知道」。→ 解锁「钥匙线」；标记 弃义",
        "effects": [
          {
            "axis": "possession",
            "delta": 72
          },
          {
            "axis": "devotion",
            "delta": -60
          },
          {
            "var": "flag",
            "value": "abandon_duty"
          }
        ]
      },
      "R": {
        "text": "开枪打 B",
        "consequence": "钥匙掉进海里。A 活着，但你俩困在船舱等死。→ 标记 情义",
        "effects": [
          {
            "axis": "devotion",
            "delta": 60
          },
          {
            "axis": "ambition",
            "delta": -48
          },
          {
            "var": "flag",
            "value": "bond"
          }
        ]
      }
    },
    "audio": {
      "BGM": "海浪+紧张节拍",
      "SFX": "L/R=枪声+回响",
      "vibration": "开枪强震250ms"
    },
    "next": {
      "default": "card08",
      "L": "card11_key"
    },
    "checklist": [
      "用枪代替对话，暴力感让选择更痛",
      "QTE限时制造本能反应"
    ]
  },
  {
    "cardId": "08",
    "chapter": "Ch4",
    "perspective": "庭审",
    "type": "normal",
    "typeLabel": "戏剧瞬间 · 两种爽感",
    "scene": "你追了十年的仇人，现在像狗一样趴着求饶。满城百姓在围观。",
    "shots": [
      {
        "shot": "Shot 01",
        "text": "高台之下，仇人跪地。字幕：「追了十年。」"
      },
      {
        "shot": "Shot 02",
        "text": "百姓安静，等你的裁决。"
      },
      {
        "shot": "Shot 03",
        "text": "仇人抬头：「求求你。」"
      }
    ],
    "options": {
      "L": {
        "text": "先原谅，再绞死",
        "consequence": "「我原谅你。」他抬头以为活了——「但我儿子死的时候没人原谅他。」你亲手绞死他。全场欢呼。→ 获得特质「伪善」",
        "effects": [
          {
            "axis": "ambition",
            "delta": 72
          },
          {
            "axis": "devotion",
            "delta": -36
          },
          {
            "var": "flag",
            "value": "hypocrisy"
          }
        ]
      },
      "R": {
        "text": "沉默割头",
        "consequence": "血溅到你脸上，你舔了一口。→ 解锁「疯魔线」。标记 复仇者",
        "effects": [
          {
            "axis": "impulse",
            "delta": 84
          },
          {
            "axis": "devotion",
            "delta": -72
          },
          {
            "var": "flag",
            "value": "berserk"
          }
        ]
      }
    },
    "audio": {
      "BGM": "L=庄严到反转下行, R=狂暴定音鼓",
      "SFX": "L=欢呼爆发, R=喷溅/吞咽",
      "vibration": "R侧强震"
    },
    "next": {
      "default": "card09",
      "L": "card12_hypocrisy"
    },
    "checklist": [
      "L=高级爽(先给希望再碾碎), R=原始爽",
      "玩家选更符合自身幻想的那个"
    ]
  },
  {
    "cardId": "09",
    "chapter": "Ch4",
    "perspective": "钟楼",
    "type": "qte",
    "typeLabel": "QTE · 7s · 一致性校验对",
    "scene": "所有人指控你是凶手。你有真凶的证据，但拿出证据会暴露你最爱之人的秘密。",
    "qteMs": 7000,
    "shots": [
      {
        "shot": "Shot 01",
        "text": "钟楼之上，人群怒吼。字幕：「你是凶手。」"
      },
      {
        "shot": "Shot 02",
        "text": "她（你最爱的人）在人群里看着你，摇头。"
      },
      {
        "shot": "Shot 03",
        "text": "证据就在你怀里。倒计时出现。"
      }
    ],
    "options": {
      "L": {
        "text": "拿出证据，洗清自己",
        "consequence": "她被当众羞辱，跳下钟楼。你活着，但永远闭眼。→ 标记 自私",
        "effects": [
          {
            "axis": "ambition",
            "delta": 60
          },
          {
            "axis": "devotion",
            "delta": -60
          },
          {
            "var": "blood",
            "delta": -1
          }
        ]
      },
      "R": {
        "text": "沉默，任由绞杀",
        "consequence": "最后一刻她站出来说「我替你死」——她认罪。你活了，但活着比死难受。→ 标记 牺牲",
        "effects": [
          {
            "axis": "devotion",
            "delta": 72
          },
          {
            "axis": "ambition",
            "delta": -48
          },
          {
            "var": "flag",
            "value": "self_sacrifice"
          }
        ]
      }
    },
    "audio": {
      "BGM": "钟声+悲怆弦乐",
      "SFX": "L=坠地闷响, R=认罪叹息/人群静默",
      "vibration": "坠地后长震"
    },
    "consistency": {
      "pairWith": "card05",
      "axis": "devotion",
      "note": "与卡05配对：此处测认知理想(牺牲/自保)"
    },
    "next": {
      "default": "card10"
    },
    "checklist": [
      "两个坏结局，玩家想有没有第三条路(没有)",
      "与卡05构成蝴蝶效应闭环"
    ]
  },
  {
    "cardId": "10",
    "chapter": "Ch4",
    "perspective": "密室",
    "type": "normal",
    "typeLabel": "超自然 · 结局覆盖",
    "scene": "魔鬼出现，给你一个愿望。代价是随机一人死亡。你看得到候选名单：母亲、爱人、最好的朋友。",
    "shots": [
      {
        "shot": "Shot 01",
        "text": "密室烛火骤暗。字幕：「代价是随机一人死亡。」"
      },
      {
        "shot": "Shot 02",
        "text": "魔鬼推来三张照片：母亲、爱人、挚友。"
      },
      {
        "shot": "Shot 03",
        "text": "魔鬼微笑：「选吧。」"
      }
    ],
    "options": {
      "L": {
        "text": "许愿「我要权力」",
        "consequence": "魔鬼笑：「如你所愿。」你走出密室，发现死的是你自己——你成了权力的傀儡。→ 锁定结局「傀儡」",
        "effects": [
          {
            "axis": "ambition",
            "delta": 96
          },
          {
            "axis": "devotion",
            "delta": -84
          },
          {
            "var": "flag",
            "value": "puppet"
          }
        ]
      },
      "R": {
        "text": "许愿「让他们都活着」",
        "consequence": "魔鬼：「可以，但你要代替他们死。」你化作灰烬，灰烬里开出一朵花。→ 解锁「圣徒线」",
        "effects": [
          {
            "axis": "devotion",
            "delta": 96
          },
          {
            "axis": "ambition",
            "delta": -84
          },
          {
            "var": "flag",
            "value": "saint"
          }
        ]
      }
    },
    "audio": {
      "BGM": "圣咏反转(不协和和弦)",
      "SFX": "L=锁链缠绕, R=花瓣绽开/消散",
      "vibration": "L侧沉重长震 / R侧渐弱"
    },
    "next": {
      "force": true,
      "target": "ending"
    },
    "checklist": [
      "打破现实逻辑，超自然转折",
      "优先级最高，覆盖一切主结局(见FRS第五章)"
    ]
  },
  {
    "cardId": "11",
    "chapter": "Ch5",
    "perspective": "黎明",
    "type": "qte",
    "typeLabel": "终章裁决 · 断后",
    "scene": "最后的门，需要一人留下断后。门外是死地，留下的人必死。",
    "qteMs": 6000,
    "shots": [
      {
        "shot": "Shot 01",
        "text": "黎明，残破的门前。字幕：「一人留下，必死。」"
      },
      {
        "shot": "Shot 02",
        "text": "队友们互相看，没人自愿。"
      },
      {
        "shot": "Shot 03",
        "text": "钥匙在你手里。倒计时出现。"
      }
    ],
    "options": {
      "L": {
        "text": "你留下断后",
        "consequence": "把钥匙给最信任的人。你死在门口，却听到门后传来他们的笑声——他们背叛了你。→ 结局：「孤王的最后一战」",
        "effects": [
          {
            "axis": "devotion",
            "delta": 72
          },
          {
            "axis": "ambition",
            "delta": -30
          },
          {
            "var": "flag",
            "value": "last_stand"
          }
        ]
      },
      "R": {
        "text": "把最弱的人推出去",
        "consequence": "他回头看你，眼神平静。你活了，但从此每晚梦见他的脸。→ 结局：「活下来的懦夫」",
        "effects": [
          {
            "axis": "possession",
            "delta": 84
          },
          {
            "axis": "devotion",
            "delta": -72
          },
          {
            "var": "flag",
            "value": "coward"
          }
        ]
      }
    },
    "audio": {
      "BGM": "L=悲壮合唱, R=低沉心跳+耳鸣",
      "SFX": "L=门合上/笑声, R=推搡/梦魇呼吸",
      "vibration": "L侧渐强 / R侧持续"
    },
    "next": {
      "force": true,
      "target": "card12"
    },
    "checklist": [
      "终章裁决卡，final_choice_11=L/R",
      "L=我以为他们会感恩(讽刺), R=一辈子不安(折磨)"
    ]
  },
  {
    "cardId": "12",
    "chapter": "Ch5",
    "perspective": "王座",
    "type": "normal",
    "typeLabel": "终章裁决 · 元叙事收尾",
    "scene": "所有人都死了，或者都走了。你一个人坐在王座上。这是最后一刻。",
    "shots": [
      {
        "shot": "Shot 01",
        "text": "空旷大殿，你独坐王座。字幕：「最后一刻。」"
      },
      {
        "shot": "Shot 02",
        "text": "回忆碎片闪过——每个死去的人。"
      },
      {
        "shot": "Shot 03",
        "text": "画面定格，等你的最后一句话。"
      }
    ],
    "options": {
      "L": {
        "text": "说「值得」",
        "consequence": "镜头拉远，王座变成棺材。→ 结局：「孤王的加冕」",
        "effects": [
          {
            "axis": "ambition",
            "delta": 60
          },
          {
            "axis": "devotion",
            "delta": -48
          },
          {
            "var": "flag",
            "value": "coronation"
          }
        ]
      },
      "R": {
        "text": "走出去，推开门",
        "consequence": "外面是阳光——画面一转，你其实死在第三章，这是幻觉。→ 结局：「最后的幻觉」",
        "effects": [
          {
            "axis": "devotion",
            "delta": 72
          },
          {
            "axis": "ambition",
            "delta": -36
          },
          {
            "var": "flag",
            "value": "illusion"
          }
        ]
      }
    },
    "audio": {
      "BGM": "L=肃穆下行到寂静, R=突然明亮(打破第四面墙)",
      "SFX": "L=棺材合上, R=门轴转动/现实重置音",
      "vibration": "R侧画面切换瞬震"
    },
    "next": {
      "force": true,
      "target": "ending"
    },
    "checklist": [
      "元叙事收尾，打破第四面墙",
      "让玩家懵一下然后想重玩"
    ]
  }
];
if (typeof window !== "undefined") window.CARDS = module.exports;
