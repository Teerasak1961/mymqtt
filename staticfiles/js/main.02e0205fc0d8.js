class PopupButton {
    constructor(element) {
        this.element = element;
        this.popup = null;
        this.setup();
    }

    openWin(tag) {
        const url = this.element.getAttribute('data-url');
        const left = this.element.getAttribute('data-left') || '200';
        const top = this.element.getAttribute('data-top') || '220';
        
        // Close existing popup if open
        if (this.popup && !this.popup.closed) {
            this.popup.close();
        }

        // Build features string
        const features = [
            'width=240',
            'height=430',
            `left=${left}`,
            `top=${top}`,
            'resizable=yes',
            'scrollbars=yes',
            'status=no',
            'location=no',
            'toolbar=no',
            'menubar=no'
        ].join(',');

        // Open new popup with complete features
        this.popup = window.open(`${url}?tag=${tag}`, 'popupWindow', features);
        
        // Focus the popup window
        if (this.popup) {
            this.popup.focus();
        }
    }

    setup() {
        this.element.addEventListener('click', (e) => {
            e.preventDefault();
            const tag = this.element.value;
            this.openWin(tag);
        });
    }
}

// Initialize popup buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btnWin').forEach(button => new PopupButton(button));
});