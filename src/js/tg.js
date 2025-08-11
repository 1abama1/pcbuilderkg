// Telegram Bot Integration for PC Builder KG
class TelegramBot {
    constructor() {
        this.botToken = '8120040906:AAEudK2QhsXgoFWRRCoUnMzXnPUVJWEhQ7k'; // Add your bot token here
        this.chatId = '1019797376'; // Add your chat ID here
        this.webhookUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        this.init();
    }

    init() {
        this.createModal();
        this.setupContactForm();
        this.setupFormValidation();
        this.setupModalTriggers();
    }

    createModal() {
        // Create modal if it doesn't exist
        if (!document.querySelector('.contact-modal')) {
            const modalHTML = `
                <div class="contact-modal" id="contactModal">
                    <div class="contact-modal-content">
                        <div class="contact-modal-header">
                            <h3 class="contact-modal-title">
                                <i class="fas fa-paper-plane"></i>
                                Свяжитесь с нами
                            </h3>
                            <button class="contact-modal-close" id="closeContactModal">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <form class="contact-form">
                            <div class="form-group">
                                <label for="name">Имя *</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="phone">Номер телефона *</label>
                                <input type="tel" id="phone" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email">
                            </div>
                            <div class="form-group">
                                <label for="message">Сообщение</label>
                                <textarea id="message" name="message" rows="4" placeholder="Расскажите о ваших требованиях..."></textarea>
                            </div>
                            <div class="form-group">
                                <label for="budget">Бюджет (сом)</label>
                                <select id="budget" name="budget">
                                    <option value="">Выберите бюджет</option>
                                    <option value="<50000">Менее 50,000 сом</option>
                                    <option value="50000-100000">50,000 - 100,000 сом</option>
                                    <option value="100000-200000">100,000 - 200,000 сом</option>
                                    <option value="200000-300000">200,000 - 300,000 сом</option>
                                    <option value="300000+">300,000+ сом</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="purpose">Цель использования</label>
                                <select id="purpose" name="purpose">
                                    <option value="">Выберите цель</option>
                                    <option value="gaming">Игры</option>
                                    <option value="work">Работа</option>
                                    <option value="study">Учеба</option>
                                    <option value="other">Другое</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i>
                                Отправить
                            </button>
                        </form>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    setupContactForm() {
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            });
        }
    }

    setupFormValidation() {
        // Phone number validation
        const phoneInput = document.querySelector('#phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                // Remove existing +996 prefix if present
                if (value.startsWith('996')) {
                    value = value.slice(3);
                }
                
                if (value.length > 0) {
                    // Format phone number for Kyrgyzstan
                    if (value.length <= 3) {
                        value = `+996 ${value}`;
                    } else if (value.length <= 6) {
                        value = `+996 ${value.slice(0, 3)} ${value.slice(3)}`;
                    } else if (value.length <= 9) {
                        value = `+996 ${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
                    } else {
                        value = `+996 ${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 9)} ${value.slice(9)}`;
                    }
                }
                e.target.value = value;
            });
        }
    }

    setupModalTriggers() {
        // Add contact button to header
        this.addContactButtonToHeader();
        
        // Setup modal open/close functionality
        this.setupModalEvents();
    }

    addContactButtonToHeader() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && !document.querySelector('.contact-nav-btn')) {
            const contactLi = document.createElement('li');
            contactLi.innerHTML = `
                <a href="#" class="btn btn-primary contact-nav-btn" id="openContactModal">
                    <i class="fas fa-phone"></i>
                    Контакты
                </a>
            `;
            navMenu.appendChild(contactLi);
            
            // Add event listener for contact button
            const contactBtn = contactLi.querySelector('.contact-nav-btn');
            if (contactBtn) {
                contactBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openModal();
                });
            }
        }
    }

    setupModalEvents() {
        const modal = document.querySelector('.contact-modal');
        const closeBtn = document.querySelector('#closeContactModal');

        if (modal && closeBtn) {
            // Close on close button click
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    this.closeModal();
                }
            });
        }
    }

    openModal() {
        const modal = document.querySelector('.contact-modal');
        if (modal) {
            // Add scroll lock to body
            document.body.classList.add('modal-open');
            
            // Show modal immediately
            modal.classList.add('active');
            
            // Focus on first input after a short delay
            setTimeout(() => {
                const firstInput = modal.querySelector('input[name="name"]');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 100);
        }
    }

    closeModal() {
        const modal = document.querySelector('.contact-modal');
        if (modal) {
            // Remove scroll lock from body
            document.body.classList.remove('modal-open');
            
            // Hide modal
            modal.classList.remove('active');
            
            // Reset form
            const form = modal.querySelector('.contact-form');
            if (form) {
                form.reset();
            }
        }
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate required fields
        if (!data.name || !data.phone) {
            this.showNotification('Пожалуйста, заполните обязательные поля', 'warning');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;

        try {
            await this.sendToTelegram(data);
            this.showNotification('Спасибо! Ваше сообщение отправлено успешно.', 'success');
            form.reset();
            this.closeModal();
        } catch (error) {
            console.error('Error sending message:', error);
            this.showNotification('Ошибка при отправке сообщения. Попробуйте еще раз.', 'warning');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async sendToTelegram(data) {
        if (!this.botToken || !this.chatId) {
            // If bot token is not configured, show development message
            console.log('Telegram bot not configured. Message data:', data);
            this.showNotification('Сообщение отправлено (тестовый режим)', 'success');
            return;
        }

        const message = this.formatMessage(data);
        
        const response = await fetch(this.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: this.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.ok) {
            throw new Error(`Telegram API error: ${result.description}`);
        }
    }

    formatMessage(data) {
        const timestamp = new Date().toLocaleString('ru-RU', {
            timeZone: 'Asia/Bishkek',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
🔔 <b>Новая заявка с сайта PC Builder KG</b>

👤 <b>Имя:</b> ${this.escapeHtml(data.name)}
📞 <b>Телефон:</b> ${this.escapeHtml(data.phone)}
${data.email ? `📧 <b>Email:</b> ${this.escapeHtml(data.email)}` : ''}
${data.budget ? `💰 <b>Бюджет:</b> ${this.escapeHtml(data.budget)} сом` : ''}
${data.purpose ? `🎯 <b>Цель:</b> ${this.escapeHtml(this.getPurposeText(data.purpose))}` : ''}
${data.message ? `💬 <b>Сообщение:</b>\n${this.escapeHtml(data.message)}` : ''}

🕒 <b>Время отправки:</b> ${timestamp}
        `.trim();
    }

    getPurposeText(purpose) {
        const purposes = {
            'gaming': 'Игры',
            'work': 'Работа',
            'study': 'Учеба',
            'other': 'Другое'
        };
        return purposes[purpose] || purpose;
    }

    escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    showNotification(message, type = 'info') {
        if (window.pcBuilder && window.pcBuilder.showNotification) {
            window.pcBuilder.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }
    }

    // Method to configure bot (call this after creating bot)
    configureBot(botToken, chatId) {
        this.botToken = botToken;
        this.chatId = chatId;
        this.webhookUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    }
}

// Initialize Telegram Bot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.telegramBot = new TelegramBot();
});
