function! s:OnTermExit(job_id, code, event)
    :q
endfunction

function! s:OpenTerm(...)
    botright new
    resize 12
    if a:0 == 0
        call termopen(&shell, {'on_exit': function('s:OnTermExit')})
    elseif termopen(a:000) == -1
        bdelete
        return
    end
    startinsert
endfunction

command! -nargs=* T call s:OpenTerm(<f-args>)
