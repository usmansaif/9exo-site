/**
 * Inline SVG icon library. Using currentColor so icons inherit surrounding
 * text/button color, and no external icon font or emoji.
 */
window.ICONS = {
    search: '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    heart: '<svg class="icon" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path></svg>',
    bag: '<svg class="icon" viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7L6 8z"></path><path d="M9 8V6a3 3 0 0 1 6 0v2"></path></svg>',
    menu: '<svg class="icon" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
    close: '<svg class="icon" viewBox="0 0 24 24"><line x1="5" y1="5" x2="19" y2="19"></line><line x1="19" y1="5" x2="5" y2="19"></line></svg>',
    chevronDown: '<svg class="icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>',
    chevronRight: '<svg class="icon" viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"></polyline></svg>',
    plus: '<svg class="icon" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"></path></svg>',
    truck: '<svg class="icon" viewBox="0 0 24 24"><rect x="1" y="6" width="14" height="11"></rect><path d="M15 10h4l3 3v4h-7z"></path><circle cx="6" cy="19" r="2"></circle><circle cx="17.5" cy="19" r="2"></circle></svg>',
    shield: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>',
    refresh: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 15.4-6.4L21 8"></path><polyline points="21 3 21 8 16 8"></polyline><path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"></path><polyline points="3 21 3 16 8 16"></polyline></svg>',
    checkCircle: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><polyline points="8 12 11 15 16 9"></polyline></svg>',
    mapPin: '<svg class="icon" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    phone: '<svg class="icon" viewBox="0 0 24 24"><path d="M4 5c0 8.8 6.2 15 15 15l3-4-6-3-2 2c-2.5-1.2-4.8-3.5-6-6l2-2-3-6z"></path></svg>',
    mail: '<svg class="icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="1"></rect><polyline points="2 6 12 13 22 6"></polyline></svg>',
    clock: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 16 14"></polyline></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z"></path><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2z"></path></svg>',
    instagram: '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"></circle></svg>',
    facebook: '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M15 8h2V5h-2c-1.7 0-3 1.3-3 3v2H10v3h2v7h3v-7h2.2l.8-3H15V8z"></path></svg>',
    tiktok: '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M15 3v10.5a2.5 2.5 0 1 1-2.5-2.5"></path><path d="M15 3c0 2.5 2 4.5 4.5 4.5"></path></svg>',
    ruler: '<svg class="icon" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="1"></rect><line x1="6" y1="7" x2="6" y2="11"></line><line x1="10" y1="7" x2="10" y2="11"></line><line x1="14" y1="7" x2="14" y2="11"></line><line x1="18" y1="7" x2="18" y2="11"></line></svg>',
    package: '<svg class="icon" viewBox="0 0 24 24"><path d="M21 8l-9-5-9 5 9 5 9-5z"></path><path d="M3 8v8l9 5 9-5V8"></path><line x1="12" y1="13" x2="12" y2="21"></line></svg>',
    leaf: '<svg class="icon" viewBox="0 0 24 24"><path d="M5 21c9 0 14-5 14-14V5h-2C8 5 3 10 3 19"></path><path d="M5 21c3-3 6-6 9-11"></path></svg>',
    award: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"></circle><polyline points="8 13 6 21 12 18 18 21 16 13"></polyline></svg>',
    minus: '<svg class="icon" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    trash: '<svg class="icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0l-1 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 6"></path></svg>'
};
