from django.contrib import admin

from common.models import Address, Comment, CommentFiles, User, UserGoogleLoginSetting

# Register your models here.
admin.site.register(Address)
admin.site.register(Comment)
admin.site.register(CommentFiles)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'is_staff')

@admin.register(UserGoogleLoginSetting)
class UserGoogleLoginSettingAdmin(admin.ModelAdmin):
    list_display = ('user', 'google_login_enabled')
    search_fields = ('user__email',)