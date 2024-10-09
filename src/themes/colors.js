const colors = {
    primary: {
        1: '#00A5D9',
        2: '#E9FAFF',
    },
    secondary: {
        1: '#E6F7EF',
        2: '#82C43C'
    },
    general_box_shadow: 'rgba(0, 0, 0, 0.06)',
    general_border_color: '#D1D1D1',
    
    pure_white: '#FFFFFF',

    buttons: {
        border_color: '#037599',
        messageBtn: {
            background_color: '#F9F9F9',
            border_color: '#D1D1D1',
            text_color: '#333333'
        }
    },
    card_views: {
        agent_card: {
            border_color: '#D1D1D1',
            gray: '#D1D1D1',
            readme_text: '#00A5D9',
            text_icon_text: '#00A5D9',
            text_icon_bg: '#E9FAFF'
        },
        gender_card: {
            first_border_color: '#808080',
            second_border_color: '#D1D1D1'
        },
        profile_card: {
            title_color: '#808080',
            border_color: '#F1F1F5',
            logout_label_color: '#E98300',
        },
        review_card: {
            border_color: '#D1D1D1',
        }
    },
    checkbox: {
        icon: {
            box_shadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
            background_color: '#f5f8fa',
            background_image: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
            hover: {
                background_color: '#ebf1f5',
            },
            disabled: {
                background: 'rgba(206,217,224,.5)',
            }
        },
        checked_icon: {
            background_color: '#00A5D9',
            background_image: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
            before: {
                background_image: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")"
            },
            hover: {
                background_color: '#106ba3'
            },
        }
    },
    icons: {
        skillBudgeIcon: {
            color: '#F9F9F9'
        }
    },
    radio_button: {
        icon: {
            box_shadow: 'inset 0 0 0 1px rgba(178,178,178,1), inset 0 -1px 0 rgba(178,178,178,1)',
            background_color: '#f5f8fa',
            background_image: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
            before: {
                background_image: 'radial-gradient(#B2B2B2,#B2B2B2 32%,transparent 37%)'
            },
            hover: {
                background_color: '#ebf1f5'
            },
            disabled: {
                background: 'rgba(206,217,224,.5)',
            }
        },
        checked_icon: {
            box_shadow: 'inset 0 0 0 1px rgba(0,165,217,1), inset 0 -1px 0 rgba(0,165,217,1)',
            background_color: '#FFF',
            background_image: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
            before: {
                background_image: 'radial-gradient(#00A5D9,#00A5D9 32%,transparent 37%)'
            },
            hover: {
                background_color: '#106ba3'
            },
        }
    },
    textboxes: {
        border_color: '#808080'
    },
}

export default colors;