import { z } from 'zod';
export const schemas = {
  war_room: z.object({
    "NATIONS": z.array(z.object({
      "name": z.string(),
      "flag": z.string(),
      "id": z.string()
    }))
  }),
  curator: z.object({
    "QUICK_QUESTIONS": z.array(z.string())
  }),
  rwa: z.object({
    "RWA_REGIONS": z.array(z.object({
      "flag": z.string(),
      "name": z.string(),
      "href": z.string(),
      "accent": z.string(),
      "commodity": z.string(),
      "commodityDetail": z.string(),
      "iconBg": z.string(),
      "id": z.string()
    }))
  }),
  world_map: z.object({
    "WORLD_PATHS": z.array(z.object({
      "d": z.string(),
      "id": z.string()
    }))
  }),
  backstories_arc: z.array(z.object({
    "ticker": z.string(),
    "origin": z.string(),
    "lore": z.string(),
    "utility": z.string(),
    "curatorNote": z.string(),
    "id": z.string()
  })),
  rpg_create_character: z.object({
    "seo": z.object({
      "title": z.string(),
      "description": z.string(),
      "canonical": z.string(),
      "ogImage": z.string()
    }),
    "hero": z.object({
      "eyebrow": z.string(),
      "title": z.string(),
      "subtitle": z.string()
    }),
    "steps": z.array(z.object({
      "title": z.string(),
      "description": z.string(),
      "id": z.string()
    })),
    "classes": z.array(z.object({
      "id": z.string(),
      "name": z.string(),
      "description": z.string(),
      "bonuses": z.array(z.string())
    })),
    "nations": z.array(z.object({
      "name": z.string(),
      "flag": z.string(),
      "id": z.string()
    })),
    "form": z.object({
      "displayNameLabel": z.string(),
      "displayNamePlaceholder": z.string(),
      "avatarLabel": z.string(),
      "avatarHint": z.string(),
      "createButton": z.string(),
      "creatingButton": z.string(),
      "errorMessage": z.string()
    })
  }),
  rpg_value_packs: z.object({
    "seo": z.object({
      "title": z.string(),
      "description": z.string()
    }),
    "hero": z.object({
      "title": z.string(),
      "subtitle": z.string()
    }),
    "wallet": z.object({
      "prompt": z.string()
    }),
    "modal": z.object({
      "title": z.string(),
      "xpLabel": z.string()
    })
  }),
  wallet: z.object({
    "SHOP_ITEMS": z.array(z.object({
      "id": z.string(),
      "name": z.string(),
      "desc": z.string(),
      "cost": z.number(),
      "icon": z.string(),
      "category": z.string()
    }))
  }),
  how_to_play: z.object({
    "ZONES": z.array(z.string())
  }),
  oasis: z.object({
    "hero": z.object({
      "badge": z.string(),
      "badgeCurrency": z.string(),
      "headline": z.string(),
      "headlineAccent": z.string(),
      "body": z.string()
    }),
    "economy": z.object({
      "primaryCurrencyLabel": z.string(),
      "primaryCurrencyValue": z.string(),
      "utilityLabel": z.string(),
      "utilityValue": z.string(),
      "walletLabel": z.string(),
      "walletValue": z.string(),
      "networkLabel": z.string(),
      "networkValue": z.string()
    }),
    "worlds": z.object({
      "badge": z.string(),
      "headline": z.string(),
      "body": z.string()
    }),
    "editions": z.object({
      "headline": z.string(),
      "body": z.string()
    }),
    "specialCoins": z.object({
      "badge": z.string(),
      "headline": z.string(),
      "body": z.string()
    }),
    "pillars": z.object({
      "headline": z.string(),
      "body": z.string()
    }),
    "interop": z.object({
      "headline": z.string(),
      "body": z.string()
    }),
    "community": z.object({
      "headline": z.string(),
      "body": z.string()
    }),
    "identity": z.object({
      "badge": z.string(),
      "headline": z.string(),
      "body": z.string(),
      "features": z.array(z.object({
        "id": z.string(),
        "text": z.string()
      })),
      "links": z.array(z.object({
        "id": z.string(),
        "label": z.string(),
        "desc": z.string(),
        "href": z.string(),
        "icon": z.string()
      }))
    }),
    "cta": z.object({
      "headline": z.string(),
      "body": z.string(),
      "primaryLabel": z.string(),
      "secondaryLabel": z.string()
    })
  }),
  community: z.object({
    "hero": z.object({
      "eyebrow": z.string(),
      "headline": z.string(),
      "body": z.string()
    }),
    "stats": z.array(z.object({
      "id": z.string(),
      "label": z.string(),
      "value": z.string()
    })),
    "zoneHubs": z.object({
      "headline": z.string(),
      "body": z.string()
    }),
    "playerIdentity": z.object({
      "headline": z.string(),
      "body": z.string(),
      "features": z.array(z.object({
        "id": z.string(),
        "icon": z.string(),
        "title": z.string(),
        "description": z.string()
      }))
    }),
    "socialHubs": z.object({
      "headline": z.string(),
      "body": z.string(),
      "channels": z.array(z.object({
        "id": z.string(),
        "name": z.string(),
        "description": z.string(),
        "status": z.string(),
        "cta": z.string(),
        "url": z.string(),
        "icon": z.string()
      }))
    }),
    "hallOfLegends": z.object({
      "headline": z.string(),
      "body": z.string(),
      "comingSoon": z.boolean(),
      "comingSoonText": z.string()
    }),
    "cta": z.object({
      "headline": z.string(),
      "body": z.string(),
      "primaryLabel": z.string(),
      "secondaryLabel": z.string()
    })
  }),
  quests: z.object({
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      headlineAccent: z.string(),
      body: z.string()
    }),
    stats: z.array(z.object({
      id: z.string(),
      value: z.string(),
      label: z.string()
    })),
    filterLabel: z.string(),
    emptyState: z.string(),
    rewardSection: z.object({
      headline: z.string(),
      body: z.string()
    }),
    rewardDisplay: z.array(z.object({
      id: z.string(),
      icon: z.string(),
      name: z.string(),
      type: z.string(),
      desc: z.string()
    })),
    cta: z.object({
      headline: z.string(),
      body: z.string(),
      primaryLabel: z.string(),
      secondaryLabel: z.string()
    }),
    tierLabels: z.object({
      bronze: z.string(),
      silver: z.string(),
      gold: z.string(),
      legendary: z.string()
    })
  }),
  calendar: z.object({
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      body: z.string()
    }),
    tabs: z.object({
      overview: z.string(),
      month: z.string(),
      seasons: z.string()
    }),
    activeLabel: z.string(),
    upcomingLabel: z.string(),
    noActive: z.string(),
    noUpcoming: z.string(),
    progressLabel: z.string(),
    coinsLabel: z.string(),
    daysLeft: z.string(),
    daysUntil: z.string(),
    cta: z.object({
      headline: z.string(),
      body: z.string(),
      primaryLabel: z.string(),
      secondaryLabel: z.string()
    })
  }),
  global: z.object({
    "MONTHS": z.array(z.string())
  }),
  about: z.object({
    "hero": z.object({
      "eyebrow": z.string(),
      "headline": z.string(),
      "subheadline": z.string()
    }),
    "mission": z.object({
      "heading": z.string(),
      "body": z.array(z.object({
        "id": z.string(),
        "text": z.string()
      }))
    }),
    "coinEconomy": z.object({
      "heading": z.string(),
      "subheading": z.string(),
      "tiers": z.array(z.object({
        "id": z.string(),
        "tier": z.string(),
        "name": z.string(),
        "symbol": z.string(),
        "description": z.string(),
        "color": z.string()
      }))
    }),
    "editions": z.object({
      "heading": z.string(),
      "subheading": z.string(),
      "list": z.array(z.object({
        "id": z.string(),
        "name": z.string(),
        "flag": z.string(),
        "coins": z.number(),
        "theme": z.string()
      }))
    }),
    "systems": z.object({
      "heading": z.string(),
      "items": z.array(z.object({
        "id": z.string(),
        "icon": z.string(),
        "name": z.string(),
        "description": z.string()
      }))
    }),
    "tienko": z.object({
      "heading": z.string(),
      "subheading": z.string(),
      "body": z.array(z.object({
        "id": z.string(),
        "text": z.string()
      }))
    }),
    "stats": z.array(z.object({
      "id": z.string(),
      "value": z.string(),
      "label": z.string()
    })),
    "cta": z.object({
      "heading": z.string(),
      "subheading": z.string(),
      "primaryLabel": z.string(),
      "primaryHref": z.string(),
      "secondaryLabel": z.string(),
      "secondaryHref": z.string()
    }),
    "seo": z.object({
      "title": z.string(),
      "description": z.string()
    })
  }),
  data: {
    blogPosts: z.array(z.object({
      "id": z.string(),
      "title": z.string(),
      "slug": z.string(),
      "excerpt": z.string(),
      "publishedAt": z.string(),
      "published": z.boolean(),
      "tags": z.array(z.string()),
      "featuredImage": z.string()
    }))
  },
  pages: {
    home: z.object({
      "hero": z.object({
        "badge": z.string(),
        "headline1": z.string(),
        "headline2": z.string(),
        "headline3": z.string(),
        "subheading": z.string(),
        "ctaPrimary": z.string(),
        "ctaSecondary": z.string()
      }),
      "howItWorks": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "steps": z.array(z.object({
          "id": z.string(),
          "step": z.string(),
          "title": z.string(),
          "desc": z.string()
        }))
      }),
      "spotlight": z.object({
        "eyebrow": z.string(),
        "undiscoveredLabel": z.string()
      }),
      "permanentCoins": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "subheading": z.string(),
        "viewAllCta": z.string(),
        "undiscoveredLabel": z.string(),
        "discoverLabel": z.string()
      }),
      "collectorTiers": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "subheading": z.string()
      }),
      "journey": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "subheading": z.string(),
        "stages": z.array(z.object({
          "id": z.string(),
          "stage": z.string(),
          "action": z.string(),
          "key": z.string(),
          "unlocks": z.string()
        }))
      }),
      "bottomCta": z.object({
        "heading": z.string(),
        "subheading": z.string(),
        "ctaPrimary": z.string(),
        "ctaSecondary": z.string()
      }),
      "disclaimer": z.string()
    }),
    coins: z.object({
      "header": z.object({
        "badge": z.string(),
        "heading": z.string(),
        "subheading": z.string(),
        "statTotalLabel": z.string(),
        "statPermanentLabel": z.string(),
        "statLiveLabel": z.string()
      }),
      "tienko": z.object({
        "flagshipBadge": z.string(),
        "buyCtaLabel": z.string()
      }),
      "permanentSection": z.object({
        "heading": z.string()
      }),
      "moreSection": z.object({
        "heading": z.string()
      }),
      "undiscoveredLabel": z.string(),
      "discoverLabel": z.string()
    })
  }
};
export type Schemas = typeof schemas;